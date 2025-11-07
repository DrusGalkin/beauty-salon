package middleware

import (
	"fmt"
	"github.com/gofiber/fiber/v3"
	"strings"
)

func (mw *Middleware) RoleMiddleware() fiber.Handler {
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
		fmt.Println(mw.au.ValidToken(token))
		claim, err := mw.au.ValidToken(token)
		if err != nil {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"err": "Невалидный токен",
			})
		}

		ctx.Locals("id", claim.Id)
		ctx.Locals("email", claim.Email)

		id := int(claim.Id)

		res, err := mw.au.IsAdmin(id)
		if err != nil {
			return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"err": "Нет прав: " + err.Error(),
			})
		}

		if !res {
			return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"err": "Нет прав",
			})
		}

		return ctx.Next()
	}
}
