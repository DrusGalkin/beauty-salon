package models

import (
	"fmt"
	"gopkg.in/mail.v2"
)

const CONFIRM_SUBJECT = "Эстетика - Подтверждение почты"
const STATEMENT = "Новая заявка от - "

func (m *MailSender) SetToAndSend(to string) error {
	const op = "MailSender.SetToAndSend"
	msg := mail.NewMessage()

	msg.SetHeader("From", m.from)
	msg.SetHeader("To", to)
	msg.SetHeader("Subject", CONFIRM_SUBJECT)
	msg.SetBody("text/html", m.html)

	if err := m.conn.DialAndSend(msg); err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	return nil
}

func (m *MailSender) SendToProfile(name string) error {
	const op = "MailSender.SendToProfile"
	msg := mail.NewMessage()

	subject := fmt.Sprintf("%s%s", STATEMENT, name)

	msg.SetHeader("From", m.from)
	msg.SetHeader("To", m.from)
	msg.SetHeader("Subject", subject)
	msg.SetBody("text/html", m.html)

	if err := m.conn.DialAndSend(msg); err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	return nil
}
