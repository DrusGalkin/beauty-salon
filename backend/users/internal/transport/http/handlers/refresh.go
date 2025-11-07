package handlers

import (
	"github.com/gofiber/fiber/v3"
	"time"
)

func (h UserHandler) Refresh(ctx fiber.Ctx) error {
	var req struct {
		Token string `json:"token"`
	}

	if err := ctx.Bind().Body(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"err": "Невалидный формат токена",
		})
	}

	if req.Token == "" {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"err": "Пользователь не авторизован",
		})
	}

	tokens, err := h.uc.Refresh(req.Token)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err.Error(),
		})
	}

	ctx.Cookie(&fiber.Cookie{
		Expires:  time.Now().Add(time.Duration(tokens.ExpiredIn)),
		Name:     COOKIES_REFRESH,
		Value:    tokens.Refresh,
		Secure:   SECURITY,
		HTTPOnly: true,
	})

	return ctx.JSON(tokens)
}
