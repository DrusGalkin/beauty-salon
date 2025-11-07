FROM golang:1.25.1

WORKDIR /services

COPY . .

RUN go mod download
RUN go build -o main ./cmd/main.go

EXPOSE 7000

CMD ["./main"]