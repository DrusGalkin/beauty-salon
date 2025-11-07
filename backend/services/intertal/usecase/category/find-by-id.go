package category

import (
	"services/intertal/domains/models"
)

func (r *CategoryUseCase) FindByID(id int) (models.Category, error) {
	return r.repo.FindByID(id)
}
