package repository

import (
	"context"
	"errors"
	"fmt"
	"github.com/DrusGalkin/auth-service-grpc/internal/domain/models"
	"go.uber.org/zap"
)

var (
	InvalidTokenError = errors.New("Невалидный токен")
	RefreshError      = errors.New("Ошибка обновления токена")
)

func (a *AuthRepository) Refresh(ctx context.Context, token string) (models.Tokens, error) {
	const op = "repository.Refresh"
	log := a.Log.With(zap.String("op", op))
	redis := a.Str.RDB

	_, err := redis.JWT.ValidToken(token)
	if err != nil {
		msg := fmt.Errorf("%v", InvalidTokenError)
		return models.Tokens{}, msg
	}

	refresh, err := a.Str.RDB.JWT.Refresh(token)
	if err != nil {
		msg := fmt.Errorf("%v: %v", RefreshError, err)
		log.Error(msg.Error())
		return models.Tokens{}, msg
	}

	return models.Tokens{
		Access:    refresh.Access,
		Refresh:   refresh.Refresh,
		ExpiredIn: refresh.ExpiredIn,
	}, nil
}
