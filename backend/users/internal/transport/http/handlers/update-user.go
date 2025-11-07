package handlers

import (
	"github.com/gofiber/fiber/v3"
	"users/internal/domain/models"
)

func (h UserHandler) Update(ctx fiber.Ctx) error {
	var req models.User
	if err := ctx.Bind().Body(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"err": "Невалидные данные: " + err.Error(),
		})
	}

	localIDstr := ctx.Locals("id")
	if localIDstr == "" || localIDstr == nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"err": "Требуется авторизация",
		})
	}

	localID, ok := localIDstr.(int)
	if !ok {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": "Ошибка получения id из контекста",
		})
	}

	if req.ID != localID {
		_, err := h.uc.IsAdmin(localID)
		if err != nil {
			return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"err": "Недостаточно прав",
			})
		}
	}

	if err := h.uc.Update(localID, req); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err.Error(),
		})
	}

	return nil
}
