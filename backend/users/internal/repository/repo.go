package repository

import (
	"context"
	"errors"
	"go.uber.org/zap"
	"time"
	"users/internal/domain/models"
	"users/internal/storage"
)

type Repository interface {
	Delete(id int) error
	FindByID(id int) (models.User, error)
	FindByEmail(email string) (models.User, error)
	GetAll() ([]models.User, error)
	Update(id int, data models.User) error
}

var (
	QueryError = errors.New("Ошибка выполнения запроса")
	NotFound   = errors.New("Пользователь не найден")
)

type UserRepository struct {
	str     storage.App
	log     *zap.Logger
	timeout time.Duration
}

func New(str storage.App, log *zap.Logger, timeout time.Duration) Repository {
	return &UserRepository{
		str:     str,
		log:     log,
		timeout: timeout,
	}
}

func (r *UserRepository) getContext() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), r.timeout)
}
