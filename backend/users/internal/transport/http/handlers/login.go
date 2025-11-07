package handlers

import (
	"github.com/gofiber/fiber/v3"
	"time"
	"users/internal/domain/models"
)

func (h UserHandler) Login(ctx fiber.Ctx) error {
	var req models.User

	if err := ctx.Bind().Body(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"err": err.Error(),
		})
	}
	tokens, err := h.uc.Login(req.Email, req.Password)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err.Error(),
		})
	}

	ctx.Cookie(&fiber.Cookie{
		Expires: time.Now().Add(24 * 30 * time.Hour),
		Name:    COOKIES_REFRESH,
		Value:   tokens.Refresh,
		Secure:  SECURITY,
	})

	return ctx.JSON(tokens)
}
