package repository

import (
	"fmt"
	"photos/internal/models"
)

func (repo *PhotoRepository) Upload(photo models.ServicePhoto) error {
	const op = "repository.Upload"

	query := `INSERT INTO photos(service_id, index, url) VALUES ($1, $2, $3)`
	db := repo.storage.DB

	ctx, cancel := repo.getContext()
	defer cancel()

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		return fmt.Errorf(op, err)
	}

	_, err = stmt.ExecContext(ctx, photo.ServiceID, photo.Index, photo.Url)
	if err != nil {
		return fmt.Errorf(op, err)
	}

	return nil
}
