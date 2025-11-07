package handlers

import (
	"github.com/gofiber/fiber/v3"
	"users/internal/domain/models"
)

func (h UserHandler) Register(ctx fiber.Ctx) error {
	var req models.User
	if err := ctx.Bind().Body(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"err": "Невалидные данные: " + err.Error(),
		})
	}

	if err := h.uc.Register(
		req.Name,
		req.Email,
		req.Password,
	); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err.Error(),
		})
	}

	return nil
}
