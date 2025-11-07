package handlers

import (
	"github.com/gofiber/fiber/v3"
	"strconv"
)

func (h UserHandler) FindUser(ctx fiber.Ctx) error {
	id, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"err": err.Error(),
		})
	}

	user, err := h.uc.FindUser(id)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err.Error(),
		})
	}

	return ctx.JSON(user)
}
