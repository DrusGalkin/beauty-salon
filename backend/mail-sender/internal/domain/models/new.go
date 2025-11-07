package models

import "gopkg.in/mail.v2"

func NewMailSender(port int, host, username, from, subject, password string) *MailSender {
	conn := mail.NewDialer(
		host,
		port,
		username,
		password,
	)

	return &MailSender{
		conn:    conn,
		from:    from,
		subject: subject,
	}
}
