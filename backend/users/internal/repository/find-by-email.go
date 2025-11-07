package repository

import (
	"database/sql"
	"errors"
	"fmt"
	"go.uber.org/zap"
	"users/internal/domain/models"
)

func (r *UserRepository) FindByEmail(email string) (models.User, error) {
	const op = "repository.FindByEmail"
	log := r.log.With(zap.String("op", op))
	db := r.str.PBD

	ctx, cancel := r.getContext()
	defer cancel()

	query := `SELECT id, name, email, password, created_at 
			  FROM users 
			  WHERE email = $1`

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		log.Error("ошибка подготовки запроса", zap.Error(err))
		return models.User{}, fmt.Errorf("%s: %w", op, ErrQueryFailed)
	}
	defer stmt.Close()

	var user models.User
	row := stmt.QueryRowContext(ctx, email)

	if err := row.Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
	); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			log.Warn("пользователь не найден", zap.String("email", email))
			return models.User{}, fmt.Errorf("%s: %w", op, ErrUserNotFound)
		}
		log.Error("ошибка сканирования результата", zap.Error(err))
		return models.User{}, fmt.Errorf("%s: %w", op, err)
	}

	return user, nil
}
