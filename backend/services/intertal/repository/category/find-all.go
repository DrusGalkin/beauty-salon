package category

import (
	"database/sql"
	"errors"
	"fmt"
	"go.uber.org/zap"
	"services/intertal/domains/models"
)

func (r *CategoryRepository) FindAll() ([]models.Category, error) {
	const op = "repository.category.FindAll"
	log := r.stg.Log.With(zap.String("op", op))
	db := r.stg.DB

	ctx, cancel := r.getContext()
	defer cancel()

	query := `select id, title from categorys order by id desc `

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		log.Error(
			op,
			zap.Error(err),
		)
		return nil, fmt.Errorf("%s: %v", op, err.Error())
	}
	defer stmt.Close()

	rows, err := stmt.QueryContext(ctx)
	if err != nil {
		log.Error(
			op,
			zap.Error(err),
		)
		return nil, fmt.Errorf("%s: %v", op, err.Error())
	}

	var categories []models.Category
	for rows.Next() {
		var category models.Category
		if err := rows.Scan(
			&category.ID,
			&category.Title,
		); err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				continue
			}
			return nil, fmt.Errorf("%s: %v", op, err.Error())
		}
		categories = append(categories, category)
	}

	return categories, nil
}
