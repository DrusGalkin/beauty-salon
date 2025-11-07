package middleware

import (
	"services/intertal/transport/grpc/auth/client"
)

type Middleware struct {
	au client.AuthServiceClient
}

func New(au client.AuthServiceClient) Middleware {
	return Middleware{
		au: au,
	}
}
