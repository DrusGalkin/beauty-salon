package app

import (
	"fmt"
	"github.com/DrusGalkin/go-mail-sender/internal/config"
	"github.com/DrusGalkin/go-mail-sender/internal/domain/models"
	"github.com/DrusGalkin/go-mail-sender/internal/storage/redis"
	"github.com/DrusGalkin/go-mail-sender/internal/transport/http"
	"github.com/DrusGalkin/go-mail-sender/internal/transport/http/handlers"
)

func Run(cfg *config.Config) {
	sender := models.NewMailSender(
		cfg.Mail.Port,
		cfg.Mail.Host,
		cfg.Mail.Hostname,
		cfg.Mail.From,
		cfg.Mail.Subject,
		cfg.Password(),
	)

	rdb := redis.New(
		cfg.Rdb.Address,
		cfg.Rdb.Password,
		cfg.Rdb.TTl,
		cfg.Rdb.Timeout,
	)

	port := fmt.Sprintf(":%d", cfg.Server.Port)

	hlr := handlers.New(rdb, sender)
	if err := http.SetupRouters(hlr).Listen(port); err != nil {
		panic(err)
	}
}
