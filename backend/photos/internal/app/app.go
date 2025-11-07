package app

import (
	"github.com/gofiber/fiber/v3"
	"photos/internal/repository"
	"photos/internal/storage"
	"photos/internal/transport/http"
	"photos/internal/transport/http/handlers"
)

func Run(db storage.Storage) *fiber.App {
	repo := repository.New(db)
	handler := handlers.New(repo)

	return http.SetupRouters(handler)
}
