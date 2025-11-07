package service

import (
	"services/intertal/domains/models"
)

func (r *ServiceUseCase) FindAll() ([]models.Service, error) {
	return r.repo.FindAll()
}
