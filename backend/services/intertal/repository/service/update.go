package service

import (
	"fmt"
	"go.uber.org/zap"
	"services/intertal/domains/models"
)

func (r *ServiceRepository) Update(id int, service models.Service) error {
	const op = "repository.service.Update"
	log := r.stg.Log.With(zap.String("op", op))
	db := r.stg.DB

	ctx, cancel := r.getContext()
	defer cancel()

	query := `update services set title=$1, description=$2, price=$3, category_id=$4 where id=$5`

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		log.Error(
			op,
			zap.Error(err),
		)
		return fmt.Errorf("%s: %v", op, err.Error())
	}
	defer stmt.Close()

	_, err = stmt.ExecContext(ctx, service.Title, service.Description, service.Price, service.CategoryID, id)
	if err != nil {
		log.Error(
			op,
			zap.Error(err),
		)
		return fmt.Errorf("%s: %v", op, err.Error())
	}

	return nil
}
