package app

import (
	"database/sql"
	"fmt"
	"github.com/gofiber/fiber/v3"
	"go.uber.org/zap"
	"other/internal/config"
	"other/internal/repository"
	"other/internal/transport/grpc/auth/client"
	"other/internal/transport/http"
	"other/internal/transport/http/handlers"
	"other/internal/transport/http/middleware"
)

func Run(cfg *config.Config, db *sql.DB, log *zap.Logger) *fiber.App {
	rep := repository.New(cfg.Server.Timeout, db, log)
	handler := handlers.New(rep)

	grpc, err := client.New(
		fmt.Sprintf("%s:%s", cfg.GRPCCfg.Network, cfg.GRPCCfg.Port),
		cfg.GRPCCfg.TimeOut,
	)
	if err != nil {
		panic(err)
	}

	md := middleware.New(grpc)
	return http.SetupRouter(handler, md)
}
