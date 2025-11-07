package jwt

import (
	"github.com/dgrijalva/jwt-go"
	"os"
	"time"
)

var (
	jwtSecret = []byte(os.Getenv("SECRET"))
)

type Claim struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
	jwt.StandardClaims
}

type JWT struct {
	AccessTTL  time.Duration
	RefreshTTL time.Duration
}

func Load(accTTL, refTTL time.Duration) JWT {
	return JWT{
		AccessTTL:  accTTL,
		RefreshTTL: refTTL,
	}
}
