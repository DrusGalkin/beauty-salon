package service

import (
	"services/intertal/domains/models"
)

func (r *ServiceUseCase) FindByID(id int) (models.Service, error) {
	return r.repo.FindByID(id)
}
