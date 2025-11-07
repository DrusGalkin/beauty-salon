package usecase

func (u *UserUseCase) Delete(id int) error {
	return u.repo.Delete(id)
}
