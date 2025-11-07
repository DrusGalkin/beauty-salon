package repository

import (
	"fmt"
	"go.uber.org/zap"
	"other/internal/domains/models"
)

func (o *OtherRepository) GetAbout() (models.About, error) {
	const op = "repository.GetAbout"
	log := o.log.With(zap.String("op", op))

	ctx, cancel := o.getContext()
	defer cancel()

	var about models.About
	query := `SELECT id, title, description FROM about ORDER BY id DESC LIMIT 1`

	err := o.db.QueryRowContext(ctx, query).Scan(
		&about.ID,
		&about.Title,
		&about.Descriptions,
	)
	if err != nil {
		log.Error(
			"failed to get about",
			zap.Error(err),
		)
		return models.About{}, fmt.Errorf("%s: %v", op, err)
	}

	return about, nil
}

func (o *OtherRepository) CreateAbout(ab models.About) error {
	const op = "repository.CreateAbout"
	log := o.log.With(zap.String("op", op))

	ctx, cancel := o.getContext()
	defer cancel()

	query := `INSERT INTO about (title, description) VALUES ($1, $2) RETURNING id`

	var id int
	err := o.db.QueryRowContext(ctx, query, ab.Title, ab.Descriptions).Scan(&id)
	if err != nil {
		log.Error(
			"failed to create about",
			zap.Error(err),
		)
		return fmt.Errorf("%s: %v", op, err)
	}

	log.Info("about created successfully", zap.Int("id", id))
	return nil
}

func (o *OtherRepository) UpdateAbout(id int, ab models.About) error {
	const op = "repository.UpdateAbout"
	log := o.log.With(zap.String("op", op))

	ctx, cancel := o.getContext()
	defer cancel()

	query := `UPDATE about SET title = $1, description = $2 WHERE id = $3`

	result, err := o.db.ExecContext(ctx, query, ab.Title, ab.Descriptions, id)
	if err != nil {
		log.Error(
			"failed to update about",
			zap.Error(err),
			zap.Int("id", id),
		)
		return fmt.Errorf("%s: %v", op, err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Error(
			"failed to get rows affected",
			zap.Error(err),
		)
		return fmt.Errorf("%s: %v", op, err)
	}

	if rowsAffected == 0 {
		log.Warn(
			"about not found for update",
			zap.Int("id", id),
		)
		return fmt.Errorf("%s: about with id %d not found", op, id)
	}

	log.Info("about updated successfully", zap.Int("id", id))
	return nil
}

func (o *OtherRepository) DeleteAbout(id int) error {
	const op = "repository.DeleteAbout"
	log := o.log.With(zap.String("op", op))

	ctx, cancel := o.getContext()
	defer cancel()

	query := `DELETE FROM about WHERE id = $1`

	result, err := o.db.ExecContext(ctx, query, id)
	if err != nil {
		log.Error(
			"failed to delete about",
			zap.Error(err),
			zap.Int("id", id),
		)
		return fmt.Errorf("%s: %v", op, err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Error(
			"failed to get rows affected",
			zap.Error(err),
		)
		return fmt.Errorf("%s: %v", op, err)
	}

	if rowsAffected == 0 {
		log.Warn(
			"about not found for deletion",
			zap.Int("id", id),
		)
		return fmt.Errorf("%s: about with id %d not found", op, id)
	}

	log.Info("about deleted successfully", zap.Int("id", id))
	return nil
}
