package category

import (
	"context"
	"services/intertal/domains/models"
	"services/intertal/storage/postgres"
	"time"
)

type Repository interface {
	FindAll() ([]models.Category, error)
	FindByID(id int) (models.Category, error)
	Create(category models.Category) (int, error)
	Update(id int, service models.Category) error
	Delete(id int) error
}

type CategoryRepository struct {
	stg     postgres.Storage
	timeout time.Duration
}

func New(stg postgres.Storage, timeout time.Duration) Repository {
	return &CategoryRepository{
		stg:     stg,
		timeout: timeout,
	}
}

func (r *CategoryRepository) getContext() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), r.timeout)
}
