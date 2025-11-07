package handlers

import (
	"fmt"
	"github.com/DrusGalkin/go-mail-sender/internal/lib"
	"github.com/DrusGalkin/go-mail-sender/pkg/templates"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func (m *MailHandler) SendToEmail(ctx *fiber.Ctx) error {
	var req ConfirmEmailRequest
	val := validator.New()

	if err := ctx.BodyParser(&req); err != nil {
		return ctx.Status(400).JSON(fiber.Map{
			"error": "Невалидные данные",
		})
	}

	if err := val.Struct(req); err != nil {
		return ctx.Status(400).JSON(fiber.Map{
			"error": "Невалидые данные",
		})
	}

	code := lib.CodeGenerate()
	m.sender.SetHTML(templates.GenerateConfirmHTML(req.Username, code))

	err := m.sender.SetToAndSend(req.Email)
	if err != nil {
		return ctx.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	key := fmt.Sprintf("%s%s", CONFIRM, req.Email)
	if err := m.rdb.SetItem(key, code); err != nil {
		return ctx.Status(500).JSON(fiber.Map{
			"redis": err.Error(),
		})
	}

	return ctx.Status(200).JSON("Сообщение отправлено на почту")
}
