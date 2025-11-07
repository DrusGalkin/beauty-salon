package lib

import (
	"log"
	"os"
)

func MustLoadDir(path string) {
	if err := os.MkdirAll(path, 0755); err != nil {
		panic("Ошибка создания директории: " + err.Error())
	}
	log.Println("Директория создана")
}
