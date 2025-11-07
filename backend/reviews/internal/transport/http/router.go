package http

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"reviews/internal/transport/http/handlers"
	"reviews/internal/transport/http/middleware"
)

func SetupRouters(handler handlers.Handler, md middleware.Middleware) *fiber.App {
	app := fiber.New()
	app.Use(cors.New(), logger.New())

	app.Get("/:id", handler.GetByServiceID)
	app.Get("/count/:id", handler.GetCount)
	app.Get("/user/:id", handler.GetByUserID)
	app.Get("/rating/:id", handler.GetAverageRating)

	auth := app.Use(md.AuthMiddleware())
	{
		auth.Post("/", handler.CreateReview)
		auth.Put("/:id", handler.UpdateComment)
		auth.Delete("/:id", handler.DeleteComment)
	}

	return app
}
