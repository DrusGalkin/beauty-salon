package http

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"other/internal/transport/http/handlers"
	"other/internal/transport/http/middleware"
)

func SetupRouter(handler *handlers.OtherHandler, middle middleware.Middleware) *fiber.App {
	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New())

	about := app.Group("/about")
	{
		about.Get("/", handler.GetAbout)
		admin := about.Use(middle.RoleMiddleware())
		{
			admin.Post("/", handler.CreateAbout)
			admin.Put("/:id", handler.UpdateAbout)
			admin.Delete("/:id", handler.DeleteAbout)
		}

	}

	contacts := app.Group("/contacts")
	{
		contacts.Get("/", handler.GetAllContacts)
		admin := contacts.Use(middle.RoleMiddleware())
		{
			admin.Post("/", handler.CreateContact)
			admin.Put("/", handler.UpdateContact)
			admin.Delete("/:id", handler.DeleteContact)
		}
	}

	teammates := app.Group("/teammates")
	{
		teammates.Get("/", handler.GetAllTeammates)
		admin := teammates.Use(middle.RoleMiddleware())
		{
			admin.Post("/", handler.CreateTeammate)
			admin.Put("/:id", handler.UpdateTeammate)
			admin.Delete("/:id", handler.DeleteTeammate)
		}
	}

	return app
}
