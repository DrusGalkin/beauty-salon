package http

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/static"
	"photos/internal/transport/http/handlers"
)

func SetupRouters(handler handlers.Handler) *fiber.App {
	app := fiber.New()
	app.Use(cors.New())
	app.Use(logger.New())

	app.Get("/*", static.New(handlers.UPLOADS_PATH))
	app.Get("/photos/:id", handler.GetByServiceID)
	app.Get("/gallery", handler.AllGallery)
	app.Get("/gallery/two", handler.TwoPhotosGallery)

	app.Post("/uploads/:serId/:index", handler.Upload)
	app.Patch("/edit-index/:serId/:index", handler.EditIndex)

	app.Post("/teammates/uploads", handler.UploadTeammatePhoto)

	app.Post("/gallery", handler.UploadGallery)
	app.Delete("/gallery/:id", handler.DeleteGallery)

	return app
}
