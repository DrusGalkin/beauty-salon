package usecase

func (u *UserUseCase) IsAdmin(id int) (bool, error) {
	return u.client.IsAdmin(id)
}
