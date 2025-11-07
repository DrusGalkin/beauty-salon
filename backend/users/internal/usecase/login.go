package usecase

import "users/internal/domain/models"

func (u *UserUseCase) Login(email, password string) (models.Tokens, error) {
	res, err := u.client.Login(email, password)
	if err != nil {
		return models.Tokens{}, err
	}

	return models.Tokens{
		Access:    res.AccessToken,
		Refresh:   res.RefreshToken,
		ExpiredIn: res.ExpiresIn,
	}, nil
}
