package models

type Teammate struct {
	ID       int    `json:"id"`
	FullName string `json:"full_name"`
	Tag      string `json:"tag"`
	PhotoID  int    `json:"photo_id"`
}

type TeammateDTO struct {
	ID       int    `json:"id"`
	FullName string `json:"full_name"`
	Tag      string `json:"tag"`
	Url      string `json:"url"`
}
