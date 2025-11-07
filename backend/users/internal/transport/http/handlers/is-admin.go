package handlers

import (
	"github.com/gofiber/fiber/v3"
	"strconv"
)

func (h UserHandler) IsAdmin(ctx fiber.Ctx) error {
	id, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"err": "Невалидные параметры",
		})
	}

	isAdmin, err := h.uc.IsAdmin(id)
	if err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"err": "Недостаточно прав",
		})
	}

	return ctx.JSON(fiber.Map{
		"admin": isAdmin,
	})
}
