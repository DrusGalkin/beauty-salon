package repository

import (
	"services/intertal/repository/category"
	"services/intertal/repository/service"
	"services/intertal/storage/postgres"
	"time"
)

func Setup(stg postgres.Storage, timeout time.Duration) (service.Repository, category.Repository) {
	return service.New(stg, timeout), category.New(stg, timeout)
}
