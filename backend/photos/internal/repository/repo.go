package repository

import (
	"context"
	"photos/internal/models"
	"photos/internal/storage"
	"time"
)

type Repository interface {
	Upload(photo models.ServicePhoto) error
	EditIndex(photo models.ServicePhoto) error
	GetByServiceID(id int) ([]models.ServicePhoto, error)

	UpdateTeammatePhoto(id int, url string) error
	UploadTeammatePhoto(url string) (int, error)

	AllGallery() ([]models.PhotoGallery, error)
	UploadGallery(path string) error
	DeleteGallery(id int) error
	TwoPhotosGallery() ([]models.PhotoGallery, error)
}

type PhotoRepository struct {
	storage storage.Storage
}

func New(storage storage.Storage) Repository {
	return &PhotoRepository{storage: storage}
}

func (repo *PhotoRepository) getContext() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), 60*time.Second)
}
