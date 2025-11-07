package usecase

import "errors"

func (u *UserUseCase) Register(name, email, password string) error {
	res, err := u.client.Register(name, email, password)
	if err != nil {
		return err
	}

	_, err = u.repo.FindByID(int(res.Id))
	if err == nil {
		return errors.New("Такой пользователь уже существует")
	}

	return nil
}
