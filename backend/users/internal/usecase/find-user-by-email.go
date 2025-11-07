package usecase

import "users/internal/domain/models"

func (u *UserUseCase) FindUserByEmail(email string) (models.User, error) {
	return u.repo.FindByEmail(email)
}
