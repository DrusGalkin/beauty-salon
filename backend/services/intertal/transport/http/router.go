package http

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
	cat "services/intertal/transport/http/handlers/category"
	"services/intertal/transport/http/handlers/service"
	"services/intertal/transport/http/middleware"
)

func SetupRouters(service service.Handler, category cat.Handler, md middleware.Middleware) *fiber.App {
	app := fiber.New()
	app.Use(cors.New())
	app.Use(logger.New())

	ser := app.Group("/services")
	{
		ser.Get("/", service.FindAll)
		ser.Get("/photo/:id", service.FindPhotosServices)
		ser.Get("/:id", service.FindByID)
	}

	cat := app.Group("/categories")
	{
		cat.Get("/", category.FindAll)
		cat.Get("/:id", category.FindByID)
	}

	// Для админа
	serAdmin := app.Group("/services").Use(md.RoleMiddleware())
	{
		serAdmin.Post("/", service.Create)
		serAdmin.Delete("/:id", service.Delete)
		serAdmin.Patch("/:id", service.Update)
	}

	catAdmin := app.Group("/categories").Use(md.RoleMiddleware())
	{
		catAdmin.Post("/", category.Create)
		catAdmin.Delete("/:id", category.Delete)
		catAdmin.Patch("/:id", category.Update)
	}

	return app
}
