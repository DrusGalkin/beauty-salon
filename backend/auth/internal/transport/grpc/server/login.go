package server

import (
	"context"
	pb "github.com/DrusGalkin/proto-gits/auth/generate"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (a *AuthServer) Login(ctx context.Context, req *pb.LogRequest) (*pb.LogResponse, error) {
	tokens, err := a.Rep.Login(ctx, req.Email, req.Password)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "cannot login: %v", err.Error())
	}
	return &pb.LogResponse{
		AccessToken:  tokens.Access,
		RefreshToken: tokens.Refresh,
		ExpiresIn:    tokens.ExpiredIn,
	}, nil
}
