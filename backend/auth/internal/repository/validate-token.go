package repository

import (
	"context"
	"errors"
	"fmt"
	"github.com/DrusGalkin/auth-service-grpc/internal/domain/models"
	"github.com/DrusGalkin/auth-service-grpc/pkg/lib/jwt"
	"go.uber.org/zap"
)

var (
	ErrTokenExpired   = errors.New("токен истек")
	ErrInvalidToken   = errors.New("невалидный токен")
	ErrTokenMalformed = errors.New("неправильный формат токена")
)

func (a *AuthRepository) ValidateToken(ctx context.Context, token string) (models.User, error) {
	const op = "repository.ValidateToken"
	log := a.Log.With(zap.String("op", op))

	claims, err := a.Str.RDB.JWT.ValidToken(token)
	if err != nil {
		var finalErr error
		switch {
		case errors.Is(err, jwt.ErrTokenExpired):
			finalErr = fmt.Errorf("%s: %w", op, ErrTokenExpired)
			log.Warn("токен истек", zap.Error(err))
		case errors.Is(err, jwt.ErrParseToken):
			finalErr = fmt.Errorf("%s: %w", op, ErrTokenMalformed)
			log.Warn("неправильный формат токена", zap.Error(err))
		default:
			finalErr = fmt.Errorf("%s: %w", op, ErrInvalidToken)
			log.Warn("невалидный токен", zap.Error(err))
		}
		return models.User{}, finalErr
	}

	return models.User{
		ID:    claims.ID,
		Email: claims.Email,
	}, nil
}
