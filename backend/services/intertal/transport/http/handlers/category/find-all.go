package service

import (
	"github.com/gofiber/fiber/v3"
)

func (h *CategoryHandler) FindAll(ctx fiber.Ctx) error {
	categorys, err := h.uc.FindAll()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.JSON(categorys)
}
