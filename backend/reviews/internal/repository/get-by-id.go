package repository

import (
	"go.uber.org/zap"
	"reviews/internal/domain/models"
)

func (repo *ReviewsRepository) GetByID(id int) (models.Reviews, error) {
	const op = "repository.GetByID"
	log := repo.log.With(zap.String("op", op))
	ctx, cancel := repo.getContext()
	defer cancel()

	query := `
				select 
					id, user_id, service_id, content, rating 
				from reviews 
				where 
					id = $1`

	stmt, err := repo.db.PrepareContext(ctx, query)
	defer stmt.Close()

	if err != nil {
		log.Error("Failed to prepare statement", zap.Error(err))
		return models.Reviews{}, err
	}

	row := stmt.QueryRowContext(ctx, id)

	var review models.Reviews
	if err := row.Scan(
		&review.ID,
		&review.UserID,
		&review.ServiceID,
		&review.Content,
		&review.Rating,
	); err != nil {
		log.Error("Failed to scan", zap.Error(err))
		return models.Reviews{}, err
	}

	return review, nil
}
