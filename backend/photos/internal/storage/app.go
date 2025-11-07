package storage

import (
	"database/sql"
	"photos/internal/storage/database/postgres"
)

type Storage struct {
	DB *sql.DB
}

func New() Storage {
	return Storage{
		DB: postgres.New(),
	}
}
