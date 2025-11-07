package main

import (
	"fmt"
	"github.com/DrusGalkin/auth-service-grpc/pkg/lib/logger"
	"users/internal/app"
	"users/internal/config"
)

func main() {
	// Конфиг
	cfg := config.MustLoadConfig()

	// Логгер
	log := logger.Load(cfg.Env)

	// Загрузка приложения
	instance := app.Run(log, cfg)

	// Запуск сервера
	instance.Listen(
		fmt.Sprintf(":%s", cfg.ServerCfg.Port),
	)
}
