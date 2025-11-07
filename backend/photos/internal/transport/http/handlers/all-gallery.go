package handlers

import "github.com/gofiber/fiber/v3"

func (h *PhotoHandler) AllGallery(ctx fiber.Ctx) error {
	gallery, err := h.repo.AllGallery()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.JSON(gallery)
}
