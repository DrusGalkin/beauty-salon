package handlers

import (
	"github.com/gofiber/fiber/v3"
	"strconv"
)

func (h *ReviewHandler) GetByUserID(c fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	reviews, err := h.repo.GetByUserID(id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(reviews)
}
