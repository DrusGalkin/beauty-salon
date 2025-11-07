package client

import (
	"errors"
	pb "github.com/DrusGalkin/proto-gits/auth/generate"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"log"
	"time"
)

type AuthServiceClient struct {
	conn    *grpc.ClientConn
	client  pb.AuthServiceClient
	timeout time.Duration
}

var (
	ErrClientStart = errors.New("ошибка подключения клиента")
)

func New(addr string, timeout time.Duration) (AuthServiceClient, error) {

	conn, err := grpc.NewClient(
		addr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)

	if err != nil {
		return AuthServiceClient{}, errors.Join(ErrClientStart, err)
	}

	client := AuthServiceClient{
		conn:    conn,
		client:  pb.NewAuthServiceClient(conn),
		timeout: timeout,
	}

	log.Println("(Reviews) Успешное подключение к gRPC серверу")
	return client, nil
}
