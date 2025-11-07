package repository

import (
	"fmt"
)

func (repo *PhotoRepository) UploadTeammatePhoto(url string) (int, error) {
	const op = "repository.UploadTeammatePhoto"

	query := `INSERT INTO teammate_photo(url) VALUES ($1) RETURNING id`
	db := repo.storage.DB

	ctx, cancel := repo.getContext()
	defer cancel()

	var id int
	err := db.QueryRowContext(ctx, query, url).Scan(&id)
	if err != nil {
		return -1, fmt.Errorf("%s: %w", op, err)
	}

	return id, nil
}
