package app

import (
	"fmt"
	"github.com/gofiber/fiber/v3"
	"services/intertal/config"
	"services/intertal/repository"
	"services/intertal/storage/postgres"
	"services/intertal/transport/grpc/auth/client"
	"services/intertal/transport/http"
	"services/intertal/transport/http/handlers"
	"services/intertal/transport/http/middleware"
	"services/intertal/usecase"
)

func Run(stg postgres.Storage, cfg *config.Config) *fiber.App {
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

	// Репозиторий
	rser, rcat := repository.Setup(stg, cfg.Server.Timeout)

	// UseCase
	ucser, ucat := usecase.Setup(rser, rcat)

	// Handler
	hdser, hdcat := handlers.Setup(ucser, ucat)

	// Middleware
	mw := middleware.New(grpcClient)

	return http.SetupRouters(hdser, hdcat, mw)
}
