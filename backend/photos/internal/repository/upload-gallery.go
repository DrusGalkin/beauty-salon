package repository

import "fmt"

func (repo *PhotoRepository) UploadGallery(path string) error {
	const op = "repository.UploadGallery"

	query := `INSERT INTO gallery(url) VALUES ($1)`
	db := repo.storage.DB

	ctx, cancel := repo.getContext()
	defer cancel()

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		return fmt.Errorf(op, err)
	}

	_, err = stmt.ExecContext(ctx, path)
	if err != nil {
		return fmt.Errorf(op, err)
	}

	return nil
}
