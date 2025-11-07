package redis

import "context"

func (rdb *RDBClient) Delete(ctx context.Context, id int) error {
	pipe := rdb.client.Pipeline()

	pipe.Del(ctx, keyBuilder(id, ACCESS))
	pipe.Del(ctx, keyBuilder(id, REFRESH))
	pipe.Del(ctx, keyBuilder(id, EXPIRED))

	_, err := pipe.Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}
