package service

import (
	"github.com/gofiber/fiber/v3"
	"services/intertal/usecase/category"
)

type Handler interface {
	FindAll(ctx fiber.Ctx) error
	FindByID(ctx fiber.Ctx) error
	Create(ctx fiber.Ctx) error
	Update(ctx fiber.Ctx) error
	Delete(ctx fiber.Ctx) error
}

type CategoryHandler struct {
	uc category.UseCase
}

func New(uc category.UseCase) Handler {
	return &CategoryHandler{
		uc: uc,
	}
}
