package repository

import "go.uber.org/zap"

func (repo *ReviewsRepository) GetAverageRating(serviceID int) (float32, error) {
	const op = "repository.GetAverageRating"
	log := repo.log.With(zap.String("op", op))
	ctx, cancel := repo.getContext()
	defer cancel()

	query := `
		select COALESCE(AVG(rating), 0) as average_rating
		from reviews 
		where service_id = $1`

	var averageRating float32
	err := repo.db.QueryRowContext(ctx, query, serviceID).Scan(&averageRating)
	if err != nil {
		log.Error("Failed to get average rating", zap.Error(err))
		return 0, err
	}

	return averageRating, nil
}
