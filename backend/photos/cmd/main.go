package main

import (
	"github.com/joho/godotenv"
	"photos/internal/app"
	"photos/internal/storage"
	"photos/internal/storage/lib"
	"photos/internal/transport/http/handlers"
)

func main() {
	// Папка с изображениями
	lib.MustLoadDir(handlers.UPLOADS_PATH)

	// Получаем env
	godotenv.Load("./.env")

	// Подключение к бд
	db := storage.New()

	// Запуск приложения
	app.Run(db).Listen(":8069")
}
