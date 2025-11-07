package handlers

import (
	"github.com/gofiber/fiber/v3"
	"photos/internal/repository"
)

const UPLOADS_PATH = "/var/lib/photos/uploads"

type Handler interface {
	Upload(ctx fiber.Ctx) error
	EditIndex(ctx fiber.Ctx) error
	GetByServiceID(ctx fiber.Ctx) error
	UploadTeammatePhoto(ctx fiber.Ctx) error

	UploadGallery(ctx fiber.Ctx) error
	DeleteGallery(ctx fiber.Ctx) error
	AllGallery(ctx fiber.Ctx) error
	TwoPhotosGallery(ctx fiber.Ctx) error
}

type PhotoHandler struct {
	repo repository.Repository
}

func New(repo repository.Repository) Handler {
	return &PhotoHandler{repo: repo}
}
