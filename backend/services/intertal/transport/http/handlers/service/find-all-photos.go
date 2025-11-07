package service

import (
	"github.com/gofiber/fiber/v3"
	"net/http"
	"strconv"
)

func (h *ServiceHandler) FindPhotosServices(ctx fiber.Ctx) error {
	id, _ := strconv.Atoi(ctx.Params("id"))
	photos, err := h.uc.FindPhotosServices(id)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return ctx.JSON(photos)
}
