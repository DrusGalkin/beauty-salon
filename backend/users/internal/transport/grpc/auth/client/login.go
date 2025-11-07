package client

import (
	"context"
	pb "github.com/DrusGalkin/proto-gits/auth/generate"
)

func (a *AuthServiceClient) Login(email, password string) (*pb.LogResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), a.timeout)
	defer cancel()

	req := pb.LogRequest{
		Email:    email,
		Password: password,
	}

	res, err := a.client.Login(ctx, &req)
	if err != nil {
		return nil, err
	}

	return res, nil
}
