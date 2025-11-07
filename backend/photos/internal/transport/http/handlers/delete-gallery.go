package handlers

import (
	"github.com/gofiber/fiber/v3"
	"net/http"
	"strconv"
)

func (h *PhotoHandler) DeleteGallery(ctx fiber.Ctx) error {
	id, _ := strconv.Atoi(ctx.Params("id"))
	err := h.repo.DeleteGallery(id)

	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return nil
}
