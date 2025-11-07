package main

import (
	"github.com/DrusGalkin/go-mail-sender/internal/app"
	"github.com/DrusGalkin/go-mail-sender/internal/config"
)

func main() {
	cfg := config.MustLoadConfig()
	app.Run(cfg)
}
