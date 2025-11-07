package category

import (
	"services/intertal/domains/models"
)

func (r *CategoryUseCase) FindAll() ([]models.Category, error) {
	return r.repo.FindAll()
}
