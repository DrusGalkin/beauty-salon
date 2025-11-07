package client

import (
	"context"
	pb "github.com/DrusGalkin/proto-gits/auth/generate"
)

func (a *AuthServiceClient) Refresh(token string) (*pb.TokensResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), a.timeout)
	defer cancel()

	req := pb.TokenRequest{
		RefreshToken: token,
	}

	res, err := a.client.Refresh(ctx, &req)
	if err != nil {
		return nil, err
	}

	return res, nil
}
