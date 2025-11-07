package repository

import "go.uber.org/zap"

func (repo *ReviewsRepository) DeleteComment(commentID string) error {
	const op = "repository.DeleteComment"
	log := repo.log.With(zap.String("op", op))
	ctx, cancel := repo.getContext()
	defer cancel()

	query := `
		delete from reviews
		WHERE id = $1`

	stmt, err := repo.db.PrepareContext(ctx, query)
	if err != nil {
		log.Error("Failed to prepare query", zap.Error(err))
		return err
	}
	defer stmt.Close()

	_, err = stmt.ExecContext(ctx, commentID)
	if err != nil {
		log.Error("Failed to delete", zap.Error(err))
		return err
	}

	return nil
}
