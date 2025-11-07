package service

import (
	"github.com/gofiber/fiber/v3"
	"services/intertal/domains/models"
)

func (h *CategoryHandler) Create(ctx fiber.Ctx) error {
	var category models.Category
	if err := ctx.Bind().Body(&category); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Невалидный формат",
		})
	}

	id, err := h.uc.Create(category)
	if err != nil {
		return err
	}

	return ctx.JSON(fiber.Map{
		"id": id,
	})
}
