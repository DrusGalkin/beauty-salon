package main

import (
	"database/sql"
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"log"
	"os"
)

func main() {
	db := PGConn()
	defer db.Close()

	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		log.Fatal(err)
	}

	m, err := migrate.NewWithDatabaseInstance("file://migrations", "postgres", driver)
	if err != nil {
		log.Fatal(err)
	}

	err = m.Up()
	if err != nil && err != migrate.ErrNoChange {
		log.Fatal(err)
	}

	log.Println("Миграции успешно применены")
}

func PGConn() *sql.DB {
	const op = "postgres.New"
	db, err := sql.Open("postgres", buildConnStr())

	if err != nil {
		panic(op + ": " + err.Error())
	}

	if err := db.Ping(); err != nil {
		panic(op + ": " + "Некоректное подключение к бд" + err.Error())
	}
	log.Println("Успешное подключение к PostgreSQL")
	return db
}

func buildConnStr() string {
	if err := godotenv.Load(".env"); err != nil {
		panic(err)
	}

	return fmt.Sprintf("user=%s port=%s password=%s host=%s dbname=%s sslmode=%s",
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PORT"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_DB"),
		os.Getenv("POSTGRES_SSL"),
	)
}
