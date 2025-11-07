package repository

import (
	"context"
	"github.com/DrusGalkin/auth-service-grpc/internal/domain/models"
	"github.com/DrusGalkin/auth-service-grpc/internal/storage"
	"go.uber.org/zap"
)

type Repository interface {
	Login(ctx context.Context, email, password string) (models.Tokens, error)
	Refresh(ctx context.Context, token string) (models.Tokens, error)
	Register(ctx context.Context, user models.User) (int, error)
	Logout(ctx context.Context, id int) error
	ValidateToken(ctx context.Context, token string) (models.User, error)
	IsAdmin(ctx context.Context, id int) (bool, error)
}

type AuthRepository struct {
	Str *storage.App
	Log *zap.Logger
}

func New(str *storage.App, log *zap.Logger) Repository {
	return &AuthRepository{
		Str: str,
		Log: log,
	}
}
