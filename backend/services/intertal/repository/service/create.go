package service

import (
	"fmt"
	"go.uber.org/zap"
	"services/intertal/domains/models"
)

func (r *ServiceRepository) Create(service models.Service) (int, error) {
	const op = "repository.service.Create"
	log := r.stg.Log.With(zap.String("op", op))
	db := r.stg.DB

	ctx, cancel := r.getContext()
	defer cancel()

	query := `insert into services (title, description, price, category_id) values ($1, $2, $3, $4) returning id`
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
	err = db.QueryRowContext(ctx, query, service.Title, service.Description, service.Price, service.CategoryID).Scan(&id)
	if err != nil {

		log.Error(
			op,
			zap.Error(err),
		)
		return -1, fmt.Errorf("%s: %v", op, err.Error())
	}
	return id, nil
}
