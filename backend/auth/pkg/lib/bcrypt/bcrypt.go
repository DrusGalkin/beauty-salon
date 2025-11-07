package bcrypt

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func Hash(pass string) (string, error) {
	hashPass, err := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)

	if err != nil {
		return "", fmt.Errorf("Ошибка хеширования пароля: %v", err)
	}

	return string(hashPass), nil
}

func Equals(totalPass, pass string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(totalPass), []byte(pass))
	return err == nil
}
