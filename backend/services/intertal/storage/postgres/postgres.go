package postgres

import (
	"database/sql"
	"fmt"
	"github.com/joho/godotenv"
	"go.uber.org/zap"
	"os"

	_ "github.com/lib/pq"
)

type Storage struct {
	DB  *sql.DB
	Log *zap.Logger
}

func Connect(log *zap.Logger) Storage {
	const op = "postgres.Connect"
	var stg Storage

	stg.Log = log

	connStr := mustLoadEnv()
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		panic(fmt.Sprintf("%s: %v", op, err))
	}

	log = log.With(
		zap.String("op", op),
	)

	if err := db.Ping(); err != nil {
		log.Error(fmt.Sprintf("%s: %v", op, err))
		panic(fmt.Sprintf("%s: %v", op, err))
	}

	stg.DB = db
	log.Info("Успешное подключение к базе данных")

	return stg
}

func mustLoadEnv() string {
	const op = "postgres.mustLoadEnv"

	err := godotenv.Load("./.env")
	if err != nil {
		panic(fmt.Sprintf("%s: %v", op, err))
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
