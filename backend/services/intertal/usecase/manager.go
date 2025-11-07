package usecase

import (
	"services/intertal/repository/category"
	"services/intertal/repository/service"
	category2 "services/intertal/usecase/category"
	service2 "services/intertal/usecase/service"
)

func Setup(rs service.Repository, rc category.Repository) (service2.UseCase, category2.UseCase) {
	return service2.New(rs), category2.New(rc)
}
