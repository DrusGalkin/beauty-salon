package handlers

import (
	"github.com/gofiber/fiber/v3"
	"reviews/internal/domain/models"
)

func (p *ReviewHandler) CreateReview(c fiber.Ctx) error {
	id := c.Locals("id").(int)

	var rev models.Reviews
	if err := c.Bind().Body(&rev); err != nil {
		return c.Status(400).JSON(&fiber.Map{
			"error": "bad request: " + err.Error(),
		})
	}

	rev.UserID = id
	err := p.repo.CreateReview(rev)
	if err != nil {
		return c.Status(500).JSON(&fiber.Map{
			"error": "internal server error: " + err.Error(),
		})
	}

	return nil
}
