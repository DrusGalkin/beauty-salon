package handlers

import (
	cat "services/intertal/transport/http/handlers/category"
	ser "services/intertal/transport/http/handlers/service"
	"services/intertal/usecase/category"
	"services/intertal/usecase/service"
)

func Setup(ucser service.UseCase, ucat category.UseCase) (ser.Handler, cat.Handler) {
	return ser.New(ucser), cat.New(ucat)
}
