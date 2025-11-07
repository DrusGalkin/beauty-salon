package service

import "services/intertal/domains/models"

func (r *ServiceUseCase) FindByCategory(id int) ([]models.Service, error) {
	return r.repo.FindByCategory(id)
}
