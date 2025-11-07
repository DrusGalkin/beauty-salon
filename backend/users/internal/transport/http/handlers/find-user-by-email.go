package handlers

import (
	"github.com/gofiber/fiber/v3"
)

type EmailRequestBody struct {
	Email string `json:"email"`
}

func (h UserHandler) FindUserByEmail(ctx fiber.Ctx) error {
	var req EmailRequestBody
	if err := ctx.Bind().Body(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"err": err.Error(),
		})
	}

	user, err := h.uc.FindUserByEmail(req.Email)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err.Error(),
		})
	}

	return ctx.JSON(user)
}
