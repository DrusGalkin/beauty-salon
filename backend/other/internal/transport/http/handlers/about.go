package handlers

import (
	"github.com/gofiber/fiber/v3"
	"other/internal/domains/models"
	"strconv"
)

func (h *OtherHandler) GetAbout(c fiber.Ctx) error {
	about, err := h.repo.GetAbout()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get about information",
		})
	}

	return c.JSON(about)
}

func (h *OtherHandler) CreateAbout(c fiber.Ctx) error {
	var about models.About
	if err := c.Bind().Body(&about); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := h.repo.CreateAbout(about); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create about information",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "About information created successfully",
	})
}

func (h *OtherHandler) UpdateAbout(c fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid ID parameter",
		})
	}

	var about models.About
	if err := c.Bind().Body(&about); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := h.repo.UpdateAbout(id, about); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update about information",
		})
	}

	return c.JSON(fiber.Map{
		"message": "About information updated successfully",
	})
}

func (h *OtherHandler) DeleteAbout(c fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid ID parameter",
		})
	}

	if err := h.repo.DeleteAbout(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete about information",
		})
	}

	return c.JSON(fiber.Map{
		"message": "About information deleted successfully",
	})
}
