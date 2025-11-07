package usecase

import (
	"users/internal/domain/models"
	"users/internal/repository"
	"users/internal/transport/grpc/auth/client"
)

type UseCase interface {
	FindUser(id int) (models.User, error)
	FindUserByEmail(email string) (models.User, error)
	GetAllUsers() ([]models.User, error)
	Logout(id int64) error

	Register(name, email, password string) error
	Refresh(token string) (models.Tokens, error)
	ValidToken(token string) (models.User, error)
	Login(email, password string) (models.Tokens, error)
	IsAdmin(id int) (bool, error)

	Update(id int, data models.User) error
	Delete(id int) error
}

type UserUseCase struct {
	repo   repository.Repository
	client client.AuthServiceClient
}

func New(repo repository.Repository, client client.AuthServiceClient) UseCase {
	return &UserUseCase{
		repo:   repo,
		client: client,
	}
}
