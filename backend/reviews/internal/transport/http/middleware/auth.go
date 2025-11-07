package middleware

import (
	"github.com/gofiber/fiber/v3"
	"strings"
)

func (mw *Middleware) AuthMiddleware() fiber.Handler {
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
		claim, err := mw.au.ValidToken(token)
		if err != nil {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"err": "Невалидный токен",
			})
		}

		id := int(claim.Id)
		ctx.Locals("id", id)

		admin, err := mw.au.IsAdmin(id)
		if err != nil {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"err": "Невалидный токен",
			})
		}

		ctx.Locals("admin", admin)

		return ctx.Next()
	}
}
