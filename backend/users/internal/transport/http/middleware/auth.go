package middleware

import (
	"github.com/gofiber/fiber/v3"
	"strings"
)

func (a *App) Auth() fiber.Handler {
	return func(ctx fiber.Ctx) error {
		authHeader := ctx.Get("Authorization")

		const bearerPrefix = "Bearer "
		if !strings.HasPrefix(authHeader, bearerPrefix) {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"err": "Отсутствует или неверный формат заголовка Authorization",
			})
		}

		token := authHeader[len(bearerPrefix):]
		token = strings.TrimSpace(token)

		if token == "" {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"err": "Токен отсутствует",
			})
		}

		claim, err := a.auth.ValidToken(token)
		if err != nil {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"err": "Невалидный токен",
			})
		}

		ctx.Locals("id", claim.Id)
		ctx.Locals("email", claim.Email)

		return ctx.Next()
	}
}
