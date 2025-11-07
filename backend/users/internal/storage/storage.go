package storage

import (
	"database/sql"
	"github.com/redis/go-redis/v9"
	"users/internal/storage/database/postgres"
	rdb "users/internal/storage/database/redis"
)

type App struct {
	RDB *redis.Client
	PBD *sql.DB
}

func New() App {
	return App{
		RDB: rdb.New(),
		PBD: postgres.New(),
	}
}
