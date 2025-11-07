package category

import (
	"services/intertal/domains/models"
	"services/intertal/repository/category"
)

type UseCase interface {
	FindAll() ([]models.Category, error)
	FindByID(id int) (models.Category, error)
	Create(category models.Category) (int, error)
	Update(id int, service models.Category) error
	Delete(id int) error
}

type CategoryUseCase struct {
	repo category.Repository
}

func New(repo category.Repository) UseCase {
	return &CategoryUseCase{
		repo: repo,
	}
}
