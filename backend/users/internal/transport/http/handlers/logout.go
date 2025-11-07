package handlers

import (
	"github.com/gofiber/fiber/v3"
)

func (h UserHandler) Logout(ctx fiber.Ctx) error {
	localID := ctx.Locals("id")
	if localID == nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"err": "Пользователь не авторизован",
		})
	}

	if err := h.uc.Logout(localID.(int64)); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err.Error(),
		})
	}

	ctx.ClearCookie()
	return nil
}
