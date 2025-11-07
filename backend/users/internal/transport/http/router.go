package http

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"users/internal/transport/http/handlers"
	"users/internal/transport/http/middleware"
)

func Setup(h handlers.Handler, md middleware.App) *fiber.App {
	app := fiber.New()
	app.Use(cors.New())
	app.Use(logger.New())

	app.Post("/register", h.Register)
	app.Post("/refresh", h.Refresh)
	app.Post("/login", h.Login)
	app.Post("/valid", h.ValidToken)

	app.Get("/", h.GetAllUsers)
	app.Get("/:id", h.FindUser)
	app.Post("/check/:id", h.IsAdmin)
	app.Post("/email", h.FindUserByEmail)

	auth := app.Use(md.Auth())
	{
		auth.Patch("/password", h.UpdatePassword)
		auth.Patch("/email", h.UpdateEmail)
		auth.Delete("/", h.Delete)
		auth.Post("/out", h.Logout)
	}

	return app
}
