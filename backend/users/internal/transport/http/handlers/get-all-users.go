package handlers

import "github.com/gofiber/fiber/v3"

func (h UserHandler) GetAllUsers(ctx fiber.Ctx) error {
	users, err := h.uc.GetAllUsers()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err.Error(),
		})
	}

	return ctx.JSON(users)
}
