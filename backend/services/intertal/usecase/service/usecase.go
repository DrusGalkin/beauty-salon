package service

import (
	"services/intertal/domains/models"
	"services/intertal/repository/service"
)

type UseCase interface {
	FindAll() ([]models.Service, error)
	FindByID(id int) (models.Service, error)
	FindPhotosServices(id int) ([]models.ServicePhoto, error)
	FindByCategory(id int) ([]models.Service, error)
	Create(service models.Service) (int, error)
	Update(id int, service models.Service) error
	Delete(id int) error
}

type ServiceUseCase struct {
	repo service.Repository
}

func New(repo service.Repository) UseCase {
	return &ServiceUseCase{
		repo: repo,
	}
}
