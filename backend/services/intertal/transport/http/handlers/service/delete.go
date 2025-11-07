package service

import (
	"github.com/gofiber/fiber/v3"
	"strconv"
)

func (h *ServiceHandler) Delete(ctx fiber.Ctx) error {
	id, _ := strconv.Atoi(ctx.Params("id"))
	if err := h.uc.Delete(id); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return nil
}
