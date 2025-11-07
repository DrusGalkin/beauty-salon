package service

import (
	"database/sql"
	"errors"
	"fmt"
	"go.uber.org/zap"
	"services/intertal/domains/models"
)

func (r *ServiceRepository) FindByCategory(id int) ([]models.Service, error) {
	const op = "repository.service.FindByCategory"
	log := r.stg.Log.With(zap.String("op", op))
	db := r.stg.DB

	ctx, cancel := r.getContext()
	defer cancel()

	query := `select id, title, description, price, category_id from services where category_id = $1`

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		log.Error(
			op,
			zap.Error(err),
		)
		return nil, fmt.Errorf("%s: %v", op, err.Error())
	}
	defer stmt.Close()

	rows, err := stmt.QueryContext(ctx, id)
	if err != nil {
		log.Error(
			op,
			zap.Error(err),
		)
		return nil, fmt.Errorf("%s: %v", op, err.Error())
	}

	var services []models.Service
	for rows.Next() {
		var service models.Service
		if err := rows.Scan(
			&service.ID,
			&service.Title,
			&service.Price,
			&service.Description,
			&service.CategoryID,
		); err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				continue
			}
			return nil, fmt.Errorf("%s: %v", op, err.Error())
		}
		services = append(services, service)
	}

	return services, nil
}
