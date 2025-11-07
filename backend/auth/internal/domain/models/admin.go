package models

type Admin struct {
	ID     int    `json:"id"`
	UserID int    `json:"user_id"`
	Role   string `json:"role"`
}
