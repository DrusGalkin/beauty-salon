FROM golang:1.25

WORKDIR /photos

COPY . .

RUN go mod download
RUN go build -o main ./cmd/main.go

EXPOSE 8069

CMD ["./main"]