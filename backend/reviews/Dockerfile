FROM golang:1.25.1

WORKDIR /reviews

COPY . .

RUN go mod download
RUN go build -o main ./cmd/main.go

EXPOSE 8022

CMD ["./main"]