package postgres

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"log"
	"os"
)

func New() *sql.DB {
	const op = "postgres.New"
	db, err := sql.Open("postgres", buildConnStr())

	if err != nil {
		panic(op + ": " + err.Error())
	}

	if err := db.Ping(); err != nil {
		panic(op + ": " + "Некоректное подключение к бд")
	}
	log.Println("Успешное подключение к PostgreSQL")
	return db
}

func buildConnStr() string {
	return fmt.Sprintf("user=%s port=%s password=%s host=%s dbname=%s sslmode=%s",
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PORT"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_DB"),
		os.Getenv("POSTGRES_SSL"),
	)
}
