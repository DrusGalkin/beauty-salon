package server

import (
	"context"
	pb "github.com/DrusGalkin/proto-gits/auth/generate"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (a *AuthServer) Logout(ctx context.Context, req *pb.OutRequest) (*pb.OutResponse, error) {
	err := a.Rep.Logout(ctx, int(req.Id))
	if err != nil {
		return nil, status.Errorf(codes.Internal, err.Error())
	}

	return &pb.OutResponse{
		Exist: true,
	}, nil
}
