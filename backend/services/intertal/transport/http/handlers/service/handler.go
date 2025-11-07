package service

import (
	"github.com/gofiber/fiber/v3"
	"services/intertal/usecase/service"
)

type Handler interface {
	FindAll(ctx fiber.Ctx) error
	FindByID(ctx fiber.Ctx) error
	FindPhotosServices(ctx fiber.Ctx) error
	Create(ctx fiber.Ctx) error
	Update(ctx fiber.Ctx) error
	Delete(ctx fiber.Ctx) error
}

type ServiceHandler struct {
	uc service.UseCase
}

func New(uc service.UseCase) Handler {
	return &ServiceHandler{
		uc: uc,
	}
}
