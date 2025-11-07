package main

import (
	"fmt"
	"github.com/DrusGalkin/auth-service-grpc/pkg/lib/logger"
	"reviews/internal/app"
	"reviews/internal/config"
)

func main() {
	cfg := config.MustLoadConfig()
	log := logger.Load(cfg.Env)

	app.Run(log, cfg).Listen(
		fmt.Sprintf(":%s", cfg.ServerCfg.Port),
	)
}
