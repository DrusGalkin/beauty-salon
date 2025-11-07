package models

type About struct {
	ID           int    `json:"id"`
	Title        string `json:"title"`
	Descriptions string `json:"descriptions"`
}
