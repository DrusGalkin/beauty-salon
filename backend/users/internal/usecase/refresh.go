package usecase

import "users/internal/domain/models"

func (u *UserUseCase) Refresh(token string) (models.Tokens, error) {
	res, err := u.client.Refresh(token)
	if err != nil {
		return models.Tokens{}, err
	}

	tokens := models.Tokens{
		Access:    res.AccessToken,
		Refresh:   res.RefreshToken,
		ExpiredIn: res.ExpiresIn,
	}

	return tokens, nil
}
