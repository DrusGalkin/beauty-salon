package server

import (
	"context"
	pb "github.com/DrusGalkin/proto-gits/auth/generate"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (a *AuthServer) Refresh(ctx context.Context, req *pb.TokenRequest) (*pb.TokensResponse, error) {
	tokens, err := a.Rep.Refresh(ctx, req.RefreshToken)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "%v: %v", RegisterError, err.Error())
	}

	return &pb.TokensResponse{
		AccessToken:  tokens.Access,
		RefreshToken: tokens.Refresh,
		ExpiresIn:    tokens.ExpiredIn,
	}, nil
}
