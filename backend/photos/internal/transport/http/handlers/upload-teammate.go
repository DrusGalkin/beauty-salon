package handlers

import (
	"fmt"
	"github.com/gofiber/fiber/v3"
	"net/http"
	"time"
)

func (h *PhotoHandler) UploadTeammatePhoto(ctx fiber.Ctx) error {
	file, err := ctx.FormFile("file")
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
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

	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)
	path := "/var/lib/photos/uploads/" + filename

	if err = ctx.SaveFile(file, path); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Ошибка сохронения файла на сервер: " + err.Error(),
		})
	}

	id, err := h.repo.UploadTeammatePhoto(filename)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Ошибка сохранения файла: " + err.Error(),
		})
	}

	return ctx.JSON(fiber.Map{
		"id": id,
	})
}
