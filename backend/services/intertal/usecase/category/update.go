package category

import (
	"services/intertal/domains/models"
)

func (r *CategoryUseCase) Update(id int, service models.Category) error {
	return r.repo.Update(id, service)
}
