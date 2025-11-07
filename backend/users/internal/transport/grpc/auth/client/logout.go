package client

import (
	"context"
	pb "github.com/DrusGalkin/proto-gits/auth/generate"
)

func (a *AuthServiceClient) Logout(id int64) (*pb.OutResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), a.timeout)
	defer cancel()

	req := pb.OutRequest{
		Id: id,
	}

	res, err := a.client.Logout(ctx, &req)
	if err != nil {
		return nil, err
	}

	return res, nil
}
