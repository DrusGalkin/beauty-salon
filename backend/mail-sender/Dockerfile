FROM golang:1.25

WORKDIR /mail-sender

COPY . .

RUN go mod download
RUN go build -o main ./cmd/main.go

EXPOSE 8084

CMD ["./main"]