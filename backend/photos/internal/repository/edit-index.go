package repository

import (
	"fmt"
	"photos/internal/models"
)

func (repo *PhotoRepository) EditIndex(photo models.ServicePhoto) error {
	const op = "repository.EditIndex"

	query := `update photos set index = $1 where id = $2`
	db := repo.storage.DB

	ctx, cancel := repo.getContext()
	defer cancel()

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		return fmt.Errorf(op, err)
	}

	_, err = stmt.ExecContext(ctx, photo.Index, photo.ID)
	if err != nil {
		return fmt.Errorf(op, err)
	}

	return nil
}
