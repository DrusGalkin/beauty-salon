package service

import (
	"database/sql"
	"errors"
	"fmt"
	"go.uber.org/zap"
	"services/intertal/domains/models"
)

func (r *ServiceRepository) FindPhotosServices(id int) ([]models.ServicePhoto, error) {
	const op = "repository.service.FindPhotosServices"
	log := r.stg.Log.With(zap.String("op", op))
	db := r.stg.DB

	ctx, cancel := r.getContext()
	defer cancel()

	query := `select id, index, url from photos where service_id = $1`

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

	var photos []models.ServicePhoto
	for rows.Next() {
		var photo models.ServicePhoto
		if err := rows.Scan(
			&photo.ID,
			&photo.Index,
			&photo.Url,
		); err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				continue
			}
			return nil, fmt.Errorf("%s: %v", op, err.Error())
		}
		photos = append(photos, photo)
	}

	return photos, nil
}
