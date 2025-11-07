package repository

import (
	"fmt"
)

func (repo *PhotoRepository) UpdateTeammatePhoto(id int, url string) error {
	const op = "repository.UploadTeammatePhoto"

	query := `update teammate_photo set url = $1 where id = $2`
	db := repo.storage.DB

	ctx, cancel := repo.getContext()
	defer cancel()

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		return fmt.Errorf(op, err)
	}

	_, err = stmt.ExecContext(ctx, url, id)
	if err != nil {
		return fmt.Errorf(op, err)
	}

	return nil
}
