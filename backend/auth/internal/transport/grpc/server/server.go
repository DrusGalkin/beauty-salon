package server

import (
	"errors"
	"fmt"
	"github.com/DrusGalkin/auth-service-grpc/internal/config"
	"github.com/DrusGalkin/auth-service-grpc/internal/repository"
	pb "github.com/DrusGalkin/proto-gits/auth/generate"
	"google.golang.org/grpc"
	"log"
	"net"
)

var (
	GenerateTokenError = errors.New("GenerateTokenError")
	RegisterError      = errors.New("RegisterError")
)

type AuthServer struct {
	pb.UnimplementedAuthServiceServer
	Rep repository.Repository
	Cfg config.Config
}

func New(rep repository.Repository, cfg config.Config) AuthServer {
	return AuthServer{
		Rep: rep,
		Cfg: cfg,
	}
}

func (a *AuthServer) MustLoadGRPCServer() {
	const op = "server.MustLoadGRPCServer"
	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", a.Cfg.GRPCConfig.Port))
	if err != nil {
		panic(fmt.Errorf("%s: %v", op, err))
	}

	server := grpc.NewServer()
	pb.RegisterAuthServiceServer(server, a)

	log.Println("gRPC сервер стартует")
	if err := server.Serve(lis); err != nil {
		panic(fmt.Errorf("%s: %v", op, err))
	}
}
