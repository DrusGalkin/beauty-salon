package service

import (
	"github.com/gofiber/fiber/v3"
	"net/http"
	"strconv"
)

func (h *CategoryHandler) FindByID(ctx fiber.Ctx) error {
	id, _ := strconv.Atoi(ctx.Params("id"))
	category, err := h.uc.FindByID(id)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return ctx.JSON(category)
}
