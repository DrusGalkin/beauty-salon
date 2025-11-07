package service

import (
	"services/intertal/domains/models"
)

func (r *ServiceUseCase) FindPhotosServices(id int) ([]models.ServicePhoto, error) {
	return r.repo.FindPhotosServices(id)
}
