package client

import (
	"context"
	pb "github.com/DrusGalkin/proto-gits/auth/generate"
)

func (a *AuthServiceClient) Register(name, email, password string) (*pb.RegResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), a.timeout)
	defer cancel()

	req := pb.RegRequest{
		Name:     name,
		Email:    email,
		Password: password,
	}

	res, err := a.client.Register(ctx, &req)
	if err != nil {
		return nil, err
	}

	return res, nil
}
