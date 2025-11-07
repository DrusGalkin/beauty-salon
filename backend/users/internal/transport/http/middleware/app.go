package middleware

import (
	"github.com/redis/go-redis/v9"
	"time"
	"users/internal/transport/grpc/auth/client"
)

type App struct {
	auth  client.AuthServiceClient
	catch *redis.Client
	ttl   time.Duration
}

func New(auth client.AuthServiceClient, catch *redis.Client, ttl time.Duration) App {
	return App{
		auth:  auth,
		catch: catch,
		ttl:   ttl,
	}
}
