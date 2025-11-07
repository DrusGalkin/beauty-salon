package app

import (
	"github.com/DrusGalkin/auth-service-grpc/internal/config"
	"github.com/DrusGalkin/auth-service-grpc/internal/repository"
	"github.com/DrusGalkin/auth-service-grpc/internal/storage"
	"github.com/DrusGalkin/auth-service-grpc/internal/transport/grpc/server"
	"github.com/DrusGalkin/auth-service-grpc/pkg/lib/jwt"
	"go.uber.org/zap"
)

func Run(cfg config.Config, log *zap.Logger) server.AuthServer {
	sec := jwt.Load(
		cfg.JWTConfig.AccessTTL,
		cfg.JWTConfig.RefreshTTL,
	)

	str := storage.New(sec, cfg.GRPCConfig.Timeout)

	repo := repository.New(str, log)
	return server.New(repo, cfg)

}
