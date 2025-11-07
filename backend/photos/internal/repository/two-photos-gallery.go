package repository

import (
	"fmt"
	"photos/internal/models"
)

func (repo *PhotoRepository) TwoPhotosGallery() ([]models.PhotoGallery, error) {
	const op = "repository.AllGallery"

	query := `select id, url from gallery order by id desc limit 2`
	db := repo.storage.DB

	ctx, cancel := repo.getContext()
	defer cancel()

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}
	defer stmt.Close()

	rows, err := stmt.QueryContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}
	defer rows.Close()

	var galleries []models.PhotoGallery

	for rows.Next() {
		var gallery models.PhotoGallery
		err := rows.Scan(&gallery.ID, &gallery.Url)
		if err != nil {
			return nil, fmt.Errorf("%s: %w", op, err)
		}
		galleries = append(galleries, gallery)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return galleries, nil
}
