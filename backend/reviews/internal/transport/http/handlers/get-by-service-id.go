package handlers

import (
	"github.com/gofiber/fiber/v3"
	"strconv"
)

func (h *ReviewHandler) GetByServiceID(c fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	reviews, err := h.repo.GetByServiceID(id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(reviews)
}
