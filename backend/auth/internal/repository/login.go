package repository

import (
	"context"
	"fmt"
	"github.com/DrusGalkin/auth-service-grpc/internal/domain/models"
	"github.com/DrusGalkin/auth-service-grpc/pkg/lib/bcrypt"
	"go.uber.org/zap"
)

var (
	AuthError = fmt.Errorf("Ошибка входа")
	BadData   = fmt.Errorf("Невалидные данные")
)

func (a *AuthRepository) Login(ctx context.Context, email, password string) (models.Tokens, error) {
	const op = "repository.Login"
	log := a.Log.With(zap.String("op", op))

	query := `select 
				id, name, email, password, created_at 
				from users
				where email = $1`
	smtp, err := a.Str.PDB.PrepareContext(ctx, query)
	if err != nil {
		msg := fmt.Errorf("%v: %v", AuthError, err)
		log.Error(msg.Error())
		return models.Tokens{}, msg
	}
	defer smtp.Close()

	var user models.User
	row := smtp.QueryRowContext(ctx, email)

	if err := row.Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
	); err != nil {
		msg := fmt.Errorf("%v: %v", AuthError, err)
		log.Error(msg.Error())
		return models.Tokens{}, msg
	}

	if !bcrypt.Equals(user.Password, password) {
		return models.Tokens{}, BadData
	}

	tokens, err := a.Str.RDB.JWT.GenerateTokens(user)
	if err != nil {
		msg := fmt.Errorf("%v: %v", AuthError, err)
		log.Error(msg.Error())
		return models.Tokens{}, msg
	}

	_, err = a.Str.RDB.Set(user.ID, tokens)
	if err != nil {
		return models.Tokens{}, fmt.Errorf("%v: %v", AuthError, err)
	}

	return tokens, nil
}
