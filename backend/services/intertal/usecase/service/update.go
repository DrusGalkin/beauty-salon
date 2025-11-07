package service

import (
	"services/intertal/domains/models"
)

func (r *ServiceUseCase) Update(id int, service models.Service) error {
	return r.repo.Update(id, service)
}
