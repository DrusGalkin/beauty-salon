package client

import (
	"context"
	pb "github.com/DrusGalkin/proto-gits/auth/generate"
)

func (a *AuthServiceClient) IsAdmin(id int) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), a.timeout)
	defer cancel()

	req := &pb.IDRequest{
		Id: int64(id),
	}

	res, err := a.client.IsAdmin(ctx, req)
	if err != nil {
		return false, err
	}

	return res.IsAdmin, nil
}
