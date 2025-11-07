package repository

import "photos/internal/models"

func (repo *PhotoRepository) GetByServiceID(id int) ([]models.ServicePhoto, error) {
	const op = "repository.GetByServiceID"

	query := `
			select 
				id, url, index, service_id 
			from 
			    photos
			where 
				service_id = $1 
			order by 
				index asc limit 5`

	db := repo.storage.DB
	ctx, cancel := repo.getContext()
	defer cancel()

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	rows, err := stmt.QueryContext(ctx, id)
	if err != nil {
		return nil, err
	}

	var photos []models.ServicePhoto
	for rows.Next() {
		var photo models.ServicePhoto
		if err := rows.Scan(
			&photo.ID,
			&photo.Url,
			&photo.Index,
			&photo.ServiceID,
		); err != nil {
			continue
		}
		photos = append(photos, photo)
	}

	return photos, nil
}
