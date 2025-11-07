package http

import (
	"github.com/DrusGalkin/go-mail-sender/internal/transport/http/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func SetupRouters(handler handlers.Handler) *fiber.App {
	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173,http://127.0.0.1:5173",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization, X-Requested-With",
		AllowCredentials: true,
		ExposeHeaders:    "Content-Length, Set-Cookie",
	}))

	app.Post("/send", handler.SendToEmail)
	app.Post("/confirm", handler.ConfirmEmail)
	app.Post("/statement", handler.SendStatement)

	return app
}
