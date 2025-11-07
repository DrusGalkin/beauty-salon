package service

import (
	"context"
	"services/intertal/domains/models"
	"services/intertal/storage/postgres"
	"time"
)

type Repository interface {
	FindAll() ([]models.Service, error)
	FindByID(id int) (models.Service, error)
	FindPhotosServices(id int) ([]models.ServicePhoto, error)
	FindByCategory(id int) ([]models.Service, error)
	Create(service models.Service) (int, error)
	Update(id int, service models.Service) error
	Delete(id int) error
}

type ServiceRepository struct {
	stg     postgres.Storage
	timeout time.Duration
}

func New(stg postgres.Storage, timeout time.Duration) Repository {
	return &ServiceRepository{
		stg:     stg,
		timeout: timeout,
	}
}

func (r *ServiceRepository) getContext() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), r.timeout)
}
