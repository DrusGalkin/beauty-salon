package handlers

import (
	"github.com/gofiber/fiber/v3"
	"strconv"
)

func (h UserHandler) Delete(ctx fiber.Ctx) error {
	id, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"err": "Невалидные параметры",
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

	if id != localID {
		_, err := h.uc.IsAdmin(localID)
		if err != nil {
			return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"err": "Недостаточно прав",
			})
		}
	}

	if err := h.uc.Delete(id); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err.Error(),
		})
	}

	return nil
}
