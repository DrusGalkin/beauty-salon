package handlers

import "other/internal/repository"

type OtherHandler struct {
	repo repository.Repository
}

func New(repo repository.Repository) *OtherHandler {
	return &OtherHandler{
		repo: repo,
	}
}
