package handlers

import (
	"github.com/DrusGalkin/auth-service-grpc/pkg/lib/bcrypt"
	"github.com/gofiber/fiber/v3"
)

type UpdateEmailRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h UserHandler) UpdateEmail(ctx fiber.Ctx) error {
	var req UpdateEmailRequest
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

	if !bcrypt.Equals(data.Password, req.Password) {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Неверный пароль",
		})
	}

	currentEmail := ctx.Locals("email").(string)
	if currentEmail == req.Email {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Новый email должен отличаться от текущего",
		})
	}

	data.Email = req.Email
	if err := h.uc.Update(int(id), data); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Email успешно обновлен",
	})
}
