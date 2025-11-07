package models

import (
	"gopkg.in/mail.v2"
)

type MailSender struct {
	conn    *mail.Dialer
	from    string
	subject string
	html    string
}
