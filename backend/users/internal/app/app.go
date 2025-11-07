package app

import (
	"fmt"
	"github.com/gofiber/fiber/v3"
	"go.uber.org/zap"
	"users/internal/config"
	"users/internal/repository"
	"users/internal/storage"
	"users/internal/transport/grpc/auth/client"
	"users/internal/transport/http"
	"users/internal/transport/http/handlers"
	"users/internal/transport/http/middleware"
	"users/internal/usecase"
)

func Run(log *zap.Logger, cfg config.Config) *fiber.App {
	// Repo и Str
	str := storage.New()
	repo := repository.New(str, log, cfg.ServerCfg.TimeOut)

	// gRPC клиент
	grpcAddr := fmt.Sprintf("%s:%s",
		cfg.GRPCCfg.Network,
		cfg.GRPCCfg.Port,
	)

	grpcClient, err := client.New(
		grpcAddr,
		cfg.GRPCCfg.TimeOutStart,
	)

	if err != nil {
		panic(err)
	}

	// Usecase
	uc := usecase.New(repo, grpcClient)

	// Middleware App
	mdApp := middleware.New(
		grpcClient,
		str.RDB,
		cfg.RedisCfg.TTL,
	)

	// Handler
	hd := handlers.New(uc)

	// Загрузка Роутов
	return http.Setup(hd, mdApp)
}
