package main

import (
	"github.com/DrusGalkin/auth-service-grpc/pkg/lib/logger"
	"services/intertal/app"
	"services/intertal/config"

	"services/intertal/storage/postgres"
)

func main() {
	// Конфиг
	cfg := config.MustLoadConfig()

	// Логгер
	log := logger.Load(cfg.Env)

	// БД
	stg := postgres.Connect(log)

	// Приложение
	app.Run(stg, cfg).Listen(
		":" + cfg.Server.Port,
	)
}
