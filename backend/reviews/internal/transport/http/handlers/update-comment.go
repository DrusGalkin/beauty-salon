package handlers

import (
	"github.com/gofiber/fiber/v3"
	"reviews/internal/domain/models"
)

func (h *ReviewHandler) UpdateComment(c fiber.Ctx) error {
	userId := c.Locals("id").(int)
	var req models.Reviews
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	ser, err := h.repo.GetByID(req.ID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	admin := c.Locals("admin").(bool)
	if userId != ser.UserID || !admin {
		return c.Status(403).JSON(fiber.Map{
			"error": "Forbidden",
		})
	} else {
		err = h.repo.UpdateComment(string(req.ID), req)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
	}
	return nil
}
