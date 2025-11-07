FROM golang:1.25

WORKDIR /migrator

COPY . .

RUN go mod download
RUN go build -o main ./main.go

RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

CMD ["./main"]