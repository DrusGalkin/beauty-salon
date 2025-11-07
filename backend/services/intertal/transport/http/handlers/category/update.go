package service

import (
	"github.com/gofiber/fiber/v3"
	"services/intertal/domains/models"
	"strconv"
)

func (h *CategoryHandler) Update(ctx fiber.Ctx) error {
	id, _ := strconv.Atoi(ctx.Params("id"))

	var category models.Category
	if err := ctx.Bind().Body(&category); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Невалидный формат",
		})
	}

	err := h.uc.Update(id, category)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return nil
}
