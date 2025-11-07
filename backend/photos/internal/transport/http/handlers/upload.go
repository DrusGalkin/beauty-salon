package handlers

import (
	"fmt"
	"github.com/gofiber/fiber/v3"
	"photos/internal/models"
	"strconv"
	"time"
)

func (h *PhotoHandler) Upload(ctx fiber.Ctx) error {
	serId, _ := strconv.Atoi(ctx.Params("serId"))
	index, _ := strconv.Atoi(ctx.Params("index"))

	file, err := ctx.FormFile("file")
	if err != nil {
		return err
	}

	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
	}

	if !allowedTypes[file.Header.Get("Content-Type")] {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Недопустивый формат файла",
		})
	}

	filename := fmt.Sprintf("%d_%d_%s", serId, time.Now().Unix(), file.Filename)
	path := "/var/lib/photos/uploads/" + filename

	if err = ctx.SaveFile(file, path); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Ошибка сохронения файла на сервер: " + err.Error(),
		})
	}

	ph := models.ServicePhoto{
		Url:       filename,
		Index:     index,
		ServiceID: serId,
	}

	if err := h.repo.Upload(ph); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Ошибка сохранения изрображения: " + err.Error(),
		})
	}

	return nil
}
