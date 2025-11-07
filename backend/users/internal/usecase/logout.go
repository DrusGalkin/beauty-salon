package usecase

import "fmt"

func (u *UserUseCase) Logout(id int64) error {
	res, err := u.client.Logout(id)
	if err != nil {
		return err
	}

	if !res.Exist {
		return fmt.Errorf("Ошибка выхода из аккаунта")
	}

	return nil
}
