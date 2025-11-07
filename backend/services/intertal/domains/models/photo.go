package models

type ServicePhoto struct {
	ID        int    `json:"id"`
	Url       string `json:"url"`
	Index     int    `json:"index"`
	ServiceID int    `json:"service_id"`
}
