FROM golang:1.25

WORKDIR /other

COPY . .

RUN go mod download
RUN go build -o main ./cmd/main.go

EXPOSE 8015

CMD ["./main"]