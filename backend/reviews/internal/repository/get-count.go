package repository

import (
	"go.uber.org/zap"
)

func (repo *ReviewsRepository) GetCount(serviceID string) (int, error) {
	const op = "repository.GetCount"
	log := repo.log.With(zap.String("op", op))
	ctx, cancel := repo.getContext()
	defer cancel()

	query := `SELECT COUNT(id) FROM reviews WHERE service_id = $1`

	var count int
	err := repo.db.QueryRowContext(ctx, query, serviceID).Scan(&count)
	if err != nil {
		log.Error("Failed to get review count", zap.Error(err))
		return 0, err
	}

	return count, nil
}
