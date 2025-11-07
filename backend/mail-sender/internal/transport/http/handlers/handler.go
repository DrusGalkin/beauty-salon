package handlers

import (
	"github.com/DrusGalkin/go-mail-sender/internal/domain/models"
	"github.com/DrusGalkin/go-mail-sender/internal/storage/redis"
	"github.com/gofiber/fiber/v2"
)

type Handler interface {
	SendToEmail(*fiber.Ctx) error
	ConfirmEmail(ctx *fiber.Ctx) error
	UpdatePassword(ctx *fiber.Ctx) error
	SendStatement(ctx *fiber.Ctx) error
}

const (
	CONFIRM = "confirm_email:"
	UPDATE  = "update_password:"
)

type MailHandler struct {
	rdb    *redis.Storage
	sender *models.MailSender
}

func New(rdb *redis.Storage, sender *models.MailSender) *MailHandler {
	return &MailHandler{
		rdb:    rdb,
		sender: sender,
	}
}
