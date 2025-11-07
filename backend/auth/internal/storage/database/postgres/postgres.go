package postgres

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"log"
	"os"
)

func NewPostgres() *sql.DB {
	const op = "database.NewPostgres"

	db, err := sql.Open("postgres", fetchPostgresConnStr())
	if err != nil {
		panic(fmt.Errorf("%s: %v", op, err))
	}

	if err := db.Ping(); err != nil {
		log.Println("Ошибка подключения PostgreSQL")
		panic(fmt.Errorf("%s: %v", op, err))
	}

	log.Println("Успешное подключение к PostgreSQL")
	return db
}

func fetchPostgresConnStr() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_PORT"),
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_DB"),
		os.Getenv("POSTGRES_SSL"),
	)
}
