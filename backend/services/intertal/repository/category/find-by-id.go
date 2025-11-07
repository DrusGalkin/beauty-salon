package category

import (
	"fmt"
	"go.uber.org/zap"
	"services/intertal/domains/models"
)

func (r *CategoryRepository) FindByID(id int) (models.Category, error) {
	const op = "repository.category.FindByID"
	log := r.stg.Log.With(zap.String("op", op))
	db := r.stg.DB

	ctx, cancel := r.getContext()
	defer cancel()

	query := `select id, title from categorys where id = $1`

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		log.Error(
			op,
			zap.Error(err),
		)
		return models.Category{}, fmt.Errorf("%s: %v", op, err.Error())
	}
	defer stmt.Close()

	row := stmt.QueryRowContext(ctx, id)

	var category models.Category
	if err := row.Scan(
		&category.ID,
		&category.Title,
	); err != nil {
		return models.Category{}, fmt.Errorf("%s: %v", op, err.Error())
	}

	return category, nil
}
