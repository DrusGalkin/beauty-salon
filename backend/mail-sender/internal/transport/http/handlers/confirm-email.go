package handlers

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
)

type ConfirmEmailRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Username string `json:"username" validate:"required,min=3,max=32"`
}

type CodeFromEmail struct {
	Email string `json:"email" validate:"required,email"`
	Code  string `json:"code"`
}

func (m *MailHandler) ConfirmEmail(ctx *fiber.Ctx) error {
	var req CodeFromEmail
	if err := ctx.BodyParser(&req); err != nil {
		return ctx.Status(400).JSON(fiber.Map{
			"error": "Невалидный формат кода подтверждения",
		})
	}
	key := fmt.Sprintf("%s%s", CONFIRM, req.Email)
	code, err := m.rdb.GetItem(key)
	if err != nil {
		return ctx.Status(408).JSON(fiber.Map{
			"error": "Код просрочен",
		})
	}

	if code != req.Code {
		return ctx.Status(400).JSON(fiber.Map{
			"error": "Неперный код",
		})
	}

	if err := m.rdb.DeleteItem(key); err != nil {
		return ctx.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.Status(200).JSON("Почта подтверждена")
}
