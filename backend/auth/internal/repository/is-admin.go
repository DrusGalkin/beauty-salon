package repository

import (
	"context"
	"errors"
	"github.com/DrusGalkin/auth-service-grpc/internal/domain/models"
	"go.uber.org/zap"
)

var (
	QueryError = errors.New("Ошибка запроса")
	NotFound   = errors.New("Пользователь не найден")
)

func (a *AuthRepository) IsAdmin(ctx context.Context, id int) (bool, error) {
	const op = "repository.IsAdmin"
	log := a.Log.With(zap.String("op", op))
	db := a.Str.PDB

	query := `select role from admins where user_id = $1`
	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		log.Error(QueryError.Error())
		return false, QueryError
	}

	var admin models.Admin
	err = stmt.QueryRowContext(ctx, id).Scan(
		&admin.Role,
	)

	if err != nil {
		return false, NotFound
	}

	return true, nil
}
