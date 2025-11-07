package app

import (
	"fmt"
	"github.com/gofiber/fiber/v3"
	"go.uber.org/zap"
	"reviews/internal/config"
	"reviews/internal/repository"
	"reviews/internal/storage/database/postgres"
	"reviews/internal/transport/grpc/auth/client"
	"reviews/internal/transport/http"
	"reviews/internal/transport/http/handlers"
	"reviews/internal/transport/http/middleware"
)

func Run(log *zap.Logger, cfg config.Config) *fiber.App {

	rep := repository.New(
		postgres.New(),
		log,
		cfg.ServerCfg.TimeOut,
	)

	hd := handlers.New(rep)

	grpc, err := client.New(
		fmt.Sprintf("%s:%s",
			cfg.GRPCCfg.Network,
			cfg.GRPCCfg.Port,
		),
		cfg.GRPCCfg.TimeOut,
	)

	if err != nil {
		panic(err)
	}

	md := middleware.New(grpc)

	return http.SetupRouters(hd, md)
}
