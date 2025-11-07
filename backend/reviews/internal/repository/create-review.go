package repository

import (
	"errors"
	"go.uber.org/zap"
	"reviews/internal/domain/models"
)

func (repo *ReviewsRepository) CreateReview(rev models.Reviews) error {
	const op = "repository.CreateReview"
	log := repo.log.With(zap.String("op", op))
	ctx, cancel := repo.getContext()
	defer cancel()

	query := `insert into reviews(user_id, service_id, content, rating) values ($1,$2,$3,$4)`
	stmt, err := repo.db.PrepareContext(ctx, query)
	if err != nil {
		log.Error("Failed to prepare statement", zap.Error(err))
		return errors.New(op + ": failed to prepare statement")
	}
	defer stmt.Close()

	_, err = stmt.ExecContext(ctx, rev.UserID, rev.ServiceID, rev.Content, rev.Rating)
	if err != nil {
		log.Error("Failed to create", zap.Error(err))
		return err
	}

	return nil
}
