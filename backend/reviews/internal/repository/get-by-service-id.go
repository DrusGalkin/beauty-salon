package repository

import (
	"go.uber.org/zap"
	"reviews/internal/domain/models"
)

func (repo *ReviewsRepository) GetByServiceID(serviceID int) ([]models.Reviews, error) {
	const op = "repository.GetByServiceID"
	log := repo.log.With(zap.String("op", op))
	ctx, cancel := repo.getContext()
	defer cancel()

	query := `
				select 
					id, user_id, service_id, content, rating 
				from reviews 
				where 
					service_id = $1 
				order by 
				    id desc`

	stmt, err := repo.db.PrepareContext(ctx, query)
	defer stmt.Close()

	if err != nil {
		log.Error("Failed to prepare statement", zap.Error(err))
		return nil, err
	}

	rows, err := stmt.QueryContext(ctx, serviceID)
	defer rows.Close()

	if err != nil {
		log.Error("Failed to query", zap.Error(err))
		return nil, err
	}

	var reviews []models.Reviews
	for rows.Next() {
		var review models.Reviews
		if err := rows.Scan(
			&review.ID,
			&review.UserID,
			&review.ServiceID,
			&review.Content,
			&review.Rating,
		); err != nil {
			continue
		}
		reviews = append(reviews, review)
	}

	return reviews, nil
}
