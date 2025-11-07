package service

import (
	"github.com/gofiber/fiber/v3"
)

func (h *ServiceHandler) FindByCategory(ctx fiber.Ctx) error {
	var req struct {
		CategoryID int `json:"category_id"`
	}

	if err := ctx.Bind().Body(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Невалидный формат",
		})
	}

	categorys, err := h.uc.FindByCategory(req.CategoryID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.JSON(categorys)
}
