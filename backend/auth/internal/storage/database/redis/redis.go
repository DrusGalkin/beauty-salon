package redis

import (
	"context"
	"fmt"
	"github.com/DrusGalkin/auth-service-grpc/pkg/lib/jwt"
	"github.com/redis/go-redis/v9"
	"log"
	"os"
	"time"
)

type RDBClient struct {
	client  *redis.Client
	timeout time.Duration
	JWT     jwt.JWT
}

func NewRedis(sec jwt.JWT, timeout time.Duration) *RDBClient {
	const op = "database.NewRedis"
	addr, pass := fetchRedisConnStr()

	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: pass,
		DB:       0,
	})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Println("Ошибка подключения к Redis")
		panic(fmt.Errorf("%s: %v", op, err))
	}

	log.Println("Успешное подключение к Redis")
	return &RDBClient{
		client:  rdb,
		timeout: timeout,
		JWT:     sec,
	}
}

func fetchRedisConnStr() (string, string) {
	var addr = fmt.Sprintf("%s:%s",
		os.Getenv("REDIS_HOST"),
		os.Getenv("REDIS_PORT"),
	)

	var pass = os.Getenv("REDIS_PASSWORD")

	return addr, pass
}
