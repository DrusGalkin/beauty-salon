package lib

import (
	"crypto/rand"
	"math/big"
	"strconv"
)

const (
	MIN = 1000
	MAX = 9999
)

func CodeGenerate() string {
	diff := big.NewInt(int64(MAX - MIN + 1))

	randNum, err := rand.Int(rand.Reader, diff)
	if err != nil {
		panic(err)
	}

	result := int(randNum.Int64()) + MIN
	return strconv.Itoa(result)
}
