package handlers

import (
	"github.com/gofiber/fiber/v3"
	"other/internal/domains/models"
	"strconv"
)

func (h *OtherHandler) GetAllTeammates(c fiber.Ctx) error {
	teammates, err := h.repo.GetAllTeammate()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get teammates",
		})
	}

	return c.JSON(teammates)
}

func (h *OtherHandler) CreateTeammate(c fiber.Ctx) error {
	var teammate models.Teammate
	if err := c.Bind().Body(&teammate); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}
	id, err := h.repo.CreateTeammate(teammate)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create teammate",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"id": id,
	})
}

func (h *OtherHandler) UpdateTeammate(c fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid ID parameter",
		})
	}

	var teammate models.Teammate
	if err := c.Bind().Body(&teammate); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := h.repo.UpdateTeammate(id, teammate); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update teammate",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Teammate updated successfully",
	})
}

func (h *OtherHandler) DeleteTeammate(c fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid ID parameter",
		})
	}

	if err := h.repo.DeleteTeammate(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete teammate",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Teammate deleted successfully",
	})
}
