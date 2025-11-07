package service

import (
	"github.com/gofiber/fiber/v3"
	"services/intertal/domains/models"
	"strconv"
)

func (h *ServiceHandler) Update(ctx fiber.Ctx) error {
	id, _ := strconv.Atoi(ctx.Params("id"))

	var service models.Service
	if err := ctx.Bind().Body(&service); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Невалидный формат",
		})
	}

	err := h.uc.Update(id, service)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return nil
}
