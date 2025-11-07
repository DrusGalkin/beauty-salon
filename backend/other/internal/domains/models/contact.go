package models

type Contact struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Contacts string `json:"contacts"`
}
