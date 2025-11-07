package models

type Reviews struct {
	ID        int    `json:"id"`
	UserID    int    `json:"user_id"`
	ServiceID int    `json:"service_id"`
	Content   string `json:"content"`
	Rating    int    `json:"rating"`
}
