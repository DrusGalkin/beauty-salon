package usecase

import "users/internal/domain/models"

func (u *UserUseCase) FindUser(id int) (models.User, error) {
	return u.repo.FindByID(id)
}
