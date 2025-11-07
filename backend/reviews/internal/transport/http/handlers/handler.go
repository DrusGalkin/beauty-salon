package handlers

import (
	"github.com/gofiber/fiber/v3"
	"reviews/internal/repository"
)

type Handler interface {
	GetByServiceID(c fiber.Ctx) error
	GetByUserID(c fiber.Ctx) error
	GetCount(c fiber.Ctx) error
	GetAverageRating(c fiber.Ctx) error
	CreateReview(c fiber.Ctx) error
	DeleteComment(c fiber.Ctx) error
	UpdateComment(c fiber.Ctx) error
}

type ReviewHandler struct {
	repo repository.Repository
}

func New(repo repository.Repository) Handler {
	return &ReviewHandler{repo: repo}
}
