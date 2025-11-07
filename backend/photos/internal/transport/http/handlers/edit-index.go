package handlers

import (
	"github.com/gofiber/fiber/v3"
	"photos/internal/models"
)

func (h *PhotoHandler) EditIndex(ctx fiber.Ctx) error {
	var req struct {
		ID    int `json:"id"`
		Index int `json:"index"`
	}

	if err := ctx.Bind().Body(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Невалидные данные",
		})
	}

	ph := models.ServicePhoto{
		ID:    req.ID,
		Index: req.Index,
	}

	if err := h.repo.EditIndex(ph); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Ошибка изменения индекса фотографии: " + err.Error(),
		})
	}

	return nil
}
