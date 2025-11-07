package service

import (
	"github.com/gofiber/fiber/v3"
	"services/intertal/domains/models"
)

func (h *ServiceHandler) Create(ctx fiber.Ctx) error {
	var service models.Service
	if err := ctx.Bind().Body(&service); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Невалидный формат",
		})
	}

	id, err := h.uc.Create(service)
	if err != nil {
		return err
	}

	return ctx.JSON(fiber.Map{
		"id": id,
	})
}
