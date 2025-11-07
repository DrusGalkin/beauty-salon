package handlers

import (
	"github.com/gofiber/fiber/v3"
	"strconv"
)

func (p *ReviewHandler) DeleteComment(c fiber.Ctx) error {
	uID := c.Locals("id").(int)
	serID := c.Params("id")

	atoi, _ := strconv.Atoi(serID)

	service, err := p.repo.GetByID(atoi)
	if err != nil {
		return c.Status(500).JSON(&fiber.Map{
			"error": "internal server with delete comment:" + err.Error(),
		})
	}

	admin := c.Locals("admin").(bool)
	if uID != service.UserID || !admin {
		return c.Status(403).JSON(&fiber.Map{
			"error": "forbidden",
		})
	} else {
		err = p.repo.DeleteComment(serID)
		if err != nil {
			return c.Status(500).JSON(&fiber.Map{
				"error": "internal server with delete comment:" + err.Error(),
			})
		}
	}

	return nil
}
