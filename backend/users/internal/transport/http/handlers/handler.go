package handlers

import (
	"github.com/gofiber/fiber/v3"
	"users/internal/usecase"
)

const (
	COOKIES_REFRESH = "refresh"
	SECURITY        = false
)

type Handler interface {
	FindUser(ctx fiber.Ctx) error
	GetAllUsers(ctx fiber.Ctx) error
	FindUserByEmail(ctx fiber.Ctx) error
	Logout(ctx fiber.Ctx) error

	Register(ctx fiber.Ctx) error
	Refresh(ctx fiber.Ctx) error
	ValidToken(ctx fiber.Ctx) error
	Login(ctx fiber.Ctx) error
	IsAdmin(ctx fiber.Ctx) error

	UpdateEmail(ctx fiber.Ctx) error
	UpdatePassword(ctx fiber.Ctx) error
	Delete(ctx fiber.Ctx) error
}

type UserHandler struct {
	uc usecase.UseCase
}

func New(uc usecase.UseCase) Handler {
	return &UserHandler{
		uc: uc,
	}
}
