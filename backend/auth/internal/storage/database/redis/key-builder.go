package redis

import "fmt"

const (
	ACCESS  = "access"
	REFRESH = "refresh"
	EXPIRED = "expire"
)

func keyBuilder(id int, property string) string {
	return fmt.Sprintf("%s:%s", id, property)
}
