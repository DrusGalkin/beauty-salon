package repository

import (
	"context"
	"database/sql"
	"go.uber.org/zap"
	"other/internal/domains/models"
	"time"
)

type Repository interface {
	GetAllContacts() ([]models.Contact, error)
	CreateContact(models.Contact) error
	UpdateContact(models.Contact) error
	DeleteContact(models.Contact) error

	GetAbout() (models.About, error)
	CreateAbout(models.About) error
	UpdateAbout(id int, ab models.About) error
	DeleteAbout(id int) error

	GetAllTeammate() ([]models.TeammateDTO, error)
	CreateTeammate(teammate models.Teammate) (int, error)
	UpdateTeammate(id int, teammate models.Teammate) error
	DeleteTeammate(id int) error
}

type OtherRepository struct {
	timeout time.Duration
	db      *sql.DB
	log     *zap.Logger
}

func New(timeout time.Duration, db *sql.DB, log *zap.Logger) Repository {
	return &OtherRepository{
		timeout: timeout,
		db:      db,
		log:     log,
	}
}

func (r *OtherRepository) getContext() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), r.timeout)
}
