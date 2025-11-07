package usecase

import "users/internal/domain/models"

func (u *UserUseCase) Update(id int, data models.User) error {
	return u.repo.Update(id, data)
}
