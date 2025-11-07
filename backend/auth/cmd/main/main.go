package main

import (
	"github.com/DrusGalkin/auth-service-grpc/internal/app"
	"github.com/DrusGalkin/auth-service-grpc/internal/config"
	"github.com/DrusGalkin/auth-service-grpc/pkg/lib/logger"
)

func main() {
	// Конфиг
	cfg := config.MustLoadConfig()
	// Логгер
	log := logger.Load(cfg.Env)

	// gRPC сервер
	server := app.Run(cfg, log)
	server.MustLoadGRPCServer()
}
