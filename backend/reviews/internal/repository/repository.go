package repository

import (
	"context"
	"database/sql"
	"go.uber.org/zap"
	"reviews/internal/domain/models"
	"time"
)

type Repository interface {
	GetByID(id int) (models.Reviews, error)
	GetCount(serviceID string) (int, error)
	GetByServiceID(serviceID int) ([]models.Reviews, error)
	GetByUserID(userID int) ([]models.Reviews, error)
	GetAverageRating(serviceID int) (float32, error)
	CreateReview(rev models.Reviews) error
	DeleteComment(commentID string) error
	UpdateComment(commentID string, rev models.Reviews) error
}

type ReviewsRepository struct {
	db      *sql.DB
	log     *zap.Logger
	timeout time.Duration
}

func New(db *sql.DB, log *zap.Logger, timeout time.Duration) Repository {
	return &ReviewsRepository{
		db:      db,
		log:     log,
		timeout: timeout,
	}
}

func (r *ReviewsRepository) getContext() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), r.timeout)
}
