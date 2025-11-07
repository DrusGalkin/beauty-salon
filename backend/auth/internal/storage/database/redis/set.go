package redis

import (
	"context"
	"github.com/DrusGalkin/auth-service-grpc/internal/domain/models"
)

func (rdb *RDBClient) Set(id int, tokens models.Tokens) (int, error) {
	ctx, cancelFunc := context.WithTimeout(context.Background(), rdb.timeout)
	defer cancelFunc()

	pipe := rdb.client.Pipeline()

	pipe.Set(
		ctx,
		keyBuilder(id, ACCESS),
		tokens.Access,
		rdb.JWT.AccessTTL,
	)

	pipe.Set(
		ctx,
		keyBuilder(id, REFRESH),
		tokens.Refresh,
		rdb.JWT.RefreshTTL,
	)

	pipe.Set(
		ctx,
		keyBuilder(id, EXPIRED),
		tokens.ExpiredIn,
		rdb.JWT.AccessTTL,
	)

	cmd, err := pipe.Exec(ctx)
	if err != nil {
		return 0, err
	}

	return len(cmd), nil
}
