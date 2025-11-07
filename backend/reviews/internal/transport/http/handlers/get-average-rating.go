package handlers

import (
	"github.com/gofiber/fiber/v3"
	"strconv"
)

func (p *ReviewHandler) GetAverageRating(c fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	rating, err := p.repo.GetAverageRating(id)
	if err != nil {
		return c.Status(500).JSON(&fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"rating": rating,
	})
}
