package redis

import "context"

func (rdb *RDBClient) Get(id int) (string, error) {
	ctx, cancelFunc := context.WithTimeout(context.Background(), rdb.timeout)
	defer cancelFunc()

	key := keyBuilder(id, REFRESH)
	val, err := rdb.client.Get(ctx, key).Result()
	if err != nil {
		return "", err
	}
	return val, nil
}
