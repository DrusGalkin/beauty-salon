package handlers

import (
	"fmt"
	"github.com/DrusGalkin/auth-service-grpc/pkg/lib/bcrypt"
	"github.com/gofiber/fiber/v3"
)

type UpdatePasswordRequest struct {
	NewPassword string `json:"new_password"`
}

func (h UserHandler) UpdatePassword(ctx fiber.Ctx) error {
	var req UpdatePasswordRequest
	if err := ctx.Bind().Body(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	id, ok := ctx.Locals("id").(int64)
	if !ok {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Неавторизованный пользователь",
		})
	}

	data, err := h.uc.FindUser(int(id))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	state := bcrypt.Equals(data.Password, req.NewPassword)
	if state == false {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Неверные данные",
		})
	}

	hashPassword, err := bcrypt.Hash(req.NewPassword)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	data.Password = hashPassword
	fmt.Println(data)

	if err := h.uc.Update(int(id), data); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return nil
}
