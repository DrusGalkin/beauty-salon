package usecase

import "users/internal/domain/models"

func (u *UserUseCase) GetAllUsers() ([]models.User, error) {
	return u.repo.GetAll()
}
