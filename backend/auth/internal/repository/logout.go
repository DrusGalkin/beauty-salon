package repository

import (
	"context"
	"fmt"
	"go.uber.org/zap"
)

func (a *AuthRepository) Logout(ctx context.Context, id int) error {
	const op = "repository.Logout"
	log := a.Log.With(zap.String("op", op))
	redis := a.Str.RDB

	err := redis.Delete(ctx, id)
	if err != nil {
		msg := fmt.Errorf("%s: %v", op, err)
		log.Error(msg.Error())
		return msg
	}

	return nil
}
