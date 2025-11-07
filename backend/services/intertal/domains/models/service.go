package models

type Service struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Price       int    `json:"price"`
	Description string `json:"description"`
	CategoryID  int    `json:"category_id"`
}
