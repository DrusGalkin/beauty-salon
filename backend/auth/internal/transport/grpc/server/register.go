package server

import (
	"context"
	"github.com/DrusGalkin/auth-service-grpc/internal/domain/models"
	pb "github.com/DrusGalkin/proto-gits/auth/generate"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (a *AuthServer) Register(ctx context.Context, req *pb.RegRequest) (*pb.RegResponse, error) {
	id, err := a.Rep.Register(ctx, models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: req.Password,
	})

	if err != nil {
		return nil, status.Errorf(codes.Internal, "%v: %v", RegisterError, err.Error())
	}

	return &pb.RegResponse{
		Id: int64(id),
	}, nil
}
