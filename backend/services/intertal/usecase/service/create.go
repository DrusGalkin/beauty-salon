package service

import (
	"services/intertal/domains/models"
)

func (r *ServiceUseCase) Create(service models.Service) (int, error) {
	return r.repo.Create(service)
}
