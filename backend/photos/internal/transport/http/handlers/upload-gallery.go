package handlers

import (
	"fmt"
	"github.com/gofiber/fiber/v3"
	"time"
)

func (h *PhotoHandler) UploadGallery(ctx fiber.Ctx) error {
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

	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)
	path := "/var/lib/photos/uploads/" + filename

	if err = ctx.SaveFile(file, path); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Ошибка сохронения файла на сервер: " + err.Error(),
		})
	}

	err = h.repo.UploadGallery(filename)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Ошибка сохронения файла на сервер: " + err.Error(),
		})
	}

	return nil
}
