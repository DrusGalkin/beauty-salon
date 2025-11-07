package handlers

import (
	"github.com/gofiber/fiber/v3"
	"strconv"
)

func (h *PhotoHandler) GetByServiceID(ctx fiber.Ctx) error {
	id, _ := strconv.Atoi(ctx.Params("id"))

	photos, err := h.repo.GetByServiceID(id)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Ошибка получения фотографий: " + err.Error(),
		})
	}

	return ctx.JSON(photos)
}
