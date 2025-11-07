package models

import "time"

type User struct {
	ID        int       `json:"id" validate:"gt=0"`
	Name      string    `json:"name" validate:"required,min=3,max=20,alphanum"`
	Email     string    `json:"email" validate:"required,email"`
	Password  string    `json:"password" validate:"required,min=8"`
	CreatedAt time.Time `json:"created_at" validate:"required"`
}
