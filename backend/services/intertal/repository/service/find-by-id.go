package service

import (
	"fmt"
	"go.uber.org/zap"
	"services/intertal/domains/models"
)

func (r *ServiceRepository) FindByID(id int) (models.Service, error) {
	const op = "repository.service.FindByID"
	log := r.stg.Log.With(zap.String("op", op))
	db := r.stg.DB

	ctx, cancel := r.getContext()
	defer cancel()

	query := `select id, title, description, price, category_id from services where id = $1`

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		log.Error(
			op,
			zap.Error(err),
		)
		return models.Service{}, fmt.Errorf("%s: %v", op, err.Error())
	}
	defer stmt.Close()

	row := stmt.QueryRowContext(ctx, id)

	var service models.Service
	if err := row.Scan(
		&service.ID,
		&service.Title,
		&service.Description,
		&service.Price,
		&service.CategoryID,
	); err != nil {
		return models.Service{}, fmt.Errorf("%s: %v", op, err.Error())
	}

	return service, nil
}
