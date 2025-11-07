package storage

import (
	"database/sql"
	"github.com/DrusGalkin/auth-service-grpc/internal/storage/database/postgres"
	"github.com/DrusGalkin/auth-service-grpc/internal/storage/database/redis"
	"github.com/DrusGalkin/auth-service-grpc/pkg/lib/jwt"
	"time"
)

type App struct {
	RDB *redis.RDBClient
	PDB *sql.DB
}

func New(sec jwt.JWT, timeout time.Duration) *App {
	return &App{
		RDB: redis.NewRedis(sec, timeout),
		PDB: postgres.NewPostgres(),
	}
}
