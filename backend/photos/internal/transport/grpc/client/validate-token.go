package client

import (
	"context"
	pb "github.com/DrusGalkin/proto-gits/auth/generate"
)

func (a *AuthServiceClient) ValidToken(token string) (*pb.ValidateTokenResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), a.timeout)
	defer cancel()

	req := pb.ValidateTokenRequest{
		Token: token,
	}

	res, err := a.client.ValidToken(ctx, &req)
	if err != nil {
		return nil, err
	}

	return res, nil
}
