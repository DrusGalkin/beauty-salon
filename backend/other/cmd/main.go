package main

import (
	"fmt"
	"github.com/DrusGalkin/auth-service-grpc/pkg/lib/logger"
	"other/internal/app"
	"other/internal/config"
	"other/internal/storage/database/postgres"
)

func main() {
	cfg := config.MustLoadConfig()
	log := logger.Load(cfg.Env)
	db := postgres.New()

	app.Run(cfg, db, log).Listen(
		fmt.Sprintf(":%s", cfg.Server.Port),
	)
}
