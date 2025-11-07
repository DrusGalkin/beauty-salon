package handlers

import (
	"github.com/gofiber/fiber/v3"
)

type Response struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
}

func (h UserHandler) ValidToken(ctx fiber.Ctx) error {
	var req struct {
		Token string `json:"token"`
	}

	if err := ctx.Bind().Body(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"err": "Невалидный параметр запроса",
		})
	}

	if req.Token == "" {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"err": "Токен пуст",
		})
	}

	claims, err := h.uc.ValidToken(req.Token)
	if err != nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"err": "Невалидный токен" + err.Error(),
		})
	}

	res := Response{
		ID:    claims.ID,
		Email: claims.Email,
	}

	return ctx.JSON(res)
}
