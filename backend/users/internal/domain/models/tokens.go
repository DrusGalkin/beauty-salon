package models

type Tokens struct {
	Access    string `json:"access"`
	Refresh   string `json:"refresh"`
	ExpiredIn int64  `json:"expired_in"`
}
