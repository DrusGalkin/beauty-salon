package category

import (
	"fmt"
	"go.uber.org/zap"
	"services/intertal/domains/models"
)

func (r *CategoryRepository) Create(service models.Category) (int, error) {
	const op = "repository.category.Create"
	log := r.stg.Log.With(zap.String("op", op))
	db := r.stg.DB

	ctx, cancel := r.getContext()
	defer cancel()

	query := `insert into categorys (title) values ($1) returning id`
	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		log.Error(
			op,
			zap.Error(err),
		)
		return -1, fmt.Errorf("%s: %v", op, err.Error())
	}
	defer stmt.Close()

	var id int
	err = db.QueryRowContext(ctx, query, service.Title).Scan(&id)
	if err != nil {

		log.Error(
			op,
			zap.Error(err),
		)
		return -1, fmt.Errorf("%s: %v", op, err.Error())
	}
	return id, nil
}
