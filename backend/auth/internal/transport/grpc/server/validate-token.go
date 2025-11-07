package server

import (
	"context"
	pb "github.com/DrusGalkin/proto-gits/auth/generate"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (a *AuthServer) ValidToken(ctx context.Context, req *pb.ValidateTokenRequest) (*pb.ValidateTokenResponse, error) {
	claims, err := a.Rep.ValidateToken(ctx, req.Token)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &pb.ValidateTokenResponse{
		Id:    int64(claims.ID),
		Email: claims.Email,
	}, nil
}
