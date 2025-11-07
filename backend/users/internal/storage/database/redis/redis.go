package redis

import (
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"log"
	"os"
)

func New() *redis.Client {
	const op = "redis.New"
	addr, pass := buildRedisOptions()

	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: pass,
		DB:       0,
	})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		panic(op + ": " + "Некоректное подключение к бд")
	}

	log.Println("Успешное подключение к Redis")
	return rdb
}

func buildRedisOptions() (string, string) {
	addr := fmt.Sprintf("%s:%s",
		os.Getenv("REDIS_HOST"),
		os.Getenv("REDIS_PORT"),
	)

	return addr, os.Getenv("REDIS_PASSWORD")
}
