package repository

import "fmt"

func (repo *PhotoRepository) DeleteGallery(id int) error {
	const op = "repository.UploadGallery"

	query := `delete from gallery where id = $1`
	db := repo.storage.DB

	ctx, cancel := repo.getContext()
	defer cancel()

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		return fmt.Errorf(op, err)
	}

	_, err = stmt.ExecContext(ctx, id)
	if err != nil {
		return fmt.Errorf(op, err)
	}

	return nil
}

