package handlers

import (
	"github.com/DrusGalkin/go-mail-sender/pkg/templates"
	"github.com/gofiber/fiber/v2"
)

type StatementRequest struct {
	Name        string `json:"name"`
	PhoneNumber string `json:"phone_number"`
	Description string `json:"description"`
}

func (m *MailHandler) SendStatement(ctx *fiber.Ctx) error {
	var req StatementRequest
	if err := ctx.BodyParser(&req); err != nil {
		return ctx.Status(400).JSON(fiber.Map{
			"error": "Невалидные данные: " + err.Error(),
		})
	}

	m.sender.SetHTML(templates.GenerateApplicationHTML(
		req.Name,
		req.PhoneNumber,
		req.Description,
	))

	err := m.sender.SendToProfile(req.Name)
	if err != nil {
		return ctx.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return nil
}
