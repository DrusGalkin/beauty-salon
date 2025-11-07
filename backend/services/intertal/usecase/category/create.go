package category

import (
	"services/intertal/domains/models"
)

func (r *CategoryUseCase) Create(category models.Category) (int, error) {
	return r.repo.Create(category)
}
