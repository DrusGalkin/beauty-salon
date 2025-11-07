package handlers

import "github.com/gofiber/fiber/v3"

func (h *ReviewHandler) GetCount(c fiber.Ctx) error {
	count, err := h.repo.GetCount(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(count)
}
