package service

import (
	"github.com/gofiber/fiber/v3"
)

func (h *ServiceHandler) FindAll(ctx fiber.Ctx) error {
	services, err := h.uc.FindAll()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.JSON(services)
}
