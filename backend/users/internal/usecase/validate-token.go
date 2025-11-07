package usecase

import (
	"fmt"
	"users/internal/domain/models"
)

func (u *UserUseCase) ValidToken(token string) (models.User, error) {
	claims, err := u.client.ValidToken(token)
	fmt.Print(claims)
	if err != nil {
		return models.User{}, err
	}

	user := models.User{
		ID:    int(claims.Id),
		Email: claims.Email,
	}

	return user, nil
}
