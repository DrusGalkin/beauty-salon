package handlers

import "github.com/gofiber/fiber/v3"

func (h *PhotoHandler) TwoPhotosGallery(ctx fiber.Ctx) error {
	gallery, err := h.repo.TwoPhotosGallery()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.JSON(gallery)
}
