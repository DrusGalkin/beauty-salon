package repository

import (
	"go.uber.org/zap"
	"reviews/internal/domain/models"
)

func (repo *ReviewsRepository) UpdateComment(commentID string, rev models.Reviews) error {
	const op = "repository.UpdateComment"
	log := repo.log.With(zap.String("op", op))
	ctx, cancel := repo.getContext()
	defer cancel()

	query := `update reviews comment set content=$1, rating=$2 where id=$3`

	stmt, err := repo.db.PrepareContext(ctx, query)
	if err != nil {
		log.Error("Failed to prepare statement", zap.Error(err))
		return err
	}
	defer stmt.Close()
	
	_, err = stmt.ExecContext(ctx, commentID, rev.Content, rev.Rating)
	if err != nil {
		log.Error("Failed to update comment", zap.Error(err))
		return err
	}
	return nil
}
