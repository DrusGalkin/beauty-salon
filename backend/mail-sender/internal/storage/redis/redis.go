package redis

import (
	"github.com/redis/go-redis/v9"
	"golang.org/x/net/context"
	"time"
)

type Storage struct {
	redis.Client
	timeout time.Duration
	ttl     time.Duration
}

func New(address, password string, ttl time.Duration, timeout time.Duration) *Storage {
	rdb := redis.NewClient(&redis.Options{
		Addr:     address,
		Password: password,
		DB:       0,
	})

	return &Storage{
		Client:  *rdb,
		timeout: timeout,
		ttl:     ttl,
	}
}

func (s *Storage) SetItem(key, code string) error {
	ctx, cancel := context.WithTimeout(context.Background(), s.timeout)
	defer cancel()
	return s.Client.Set(ctx, key, code, s.ttl).Err()
}

func (s *Storage) GetItem(key string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), s.timeout)
	defer cancel()
	return s.Client.Get(ctx, key).Result()
}

func (s *Storage) DeleteItem(key string) error {
	ctx, cancel := context.WithTimeout(context.Background(), s.timeout)
	defer cancel()
	return s.Client.Del(ctx, key).Err()
}
