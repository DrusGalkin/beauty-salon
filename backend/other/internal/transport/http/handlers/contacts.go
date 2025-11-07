package handlers

import (
	"github.com/gofiber/fiber/v3"
	"other/internal/domains/models"
	"strconv"
)

func (h *OtherHandler) GetAllContacts(c fiber.Ctx) error {
	contacts, err := h.repo.GetAllContacts()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get contacts",
		})
	}

	return c.JSON(contacts)
}

func (h *OtherHandler) CreateContact(c fiber.Ctx) error {
	var contact models.Contact
	if err := c.Bind().Body(&contact); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := h.repo.CreateContact(contact); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create contact",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Contact created successfully",
	})
}

func (h *OtherHandler) UpdateContact(c fiber.Ctx) error {
	var contact models.Contact
	if err := c.Bind().Body(&contact); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := h.repo.UpdateContact(contact); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update contact",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Contact updated successfully",
	})
}

func (h *OtherHandler) DeleteContact(c fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))

	var contact models.Contact
	contact.ID = id

	if err := h.repo.DeleteContact(contact); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete contact",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Contact deleted successfully",
	})
}
