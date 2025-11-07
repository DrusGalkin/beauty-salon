package jwt

import (
	"errors"
	"fmt"
	"github.com/dgrijalva/jwt-go"
)

var (
	ErrInvalidToken = errors.New("невалидный токен")
	ErrTokenExpired = errors.New("токен истек")
	ErrParseToken   = errors.New("невалидный формат токена")
)

func (a *JWT) ValidToken(tokenStr string) (*Claim, error) {
	claim := &Claim{}

	token, err := jwt.ParseWithClaims(tokenStr, claim, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		var jwtErr *jwt.ValidationError
		if errors.As(err, &jwtErr) {
			if jwtErr.Errors&jwt.ValidationErrorExpired != 0 {
				return nil, fmt.Errorf("%w: %v", ErrTokenExpired, err)
			}
			if jwtErr.Errors&jwt.ValidationErrorMalformed != 0 {
				return nil, fmt.Errorf("%w: %v", ErrParseToken, err)
			}
		}
		return nil, fmt.Errorf("%w: %v", ErrInvalidToken, err)
	}

	if !token.Valid {
		return nil, ErrInvalidToken
	}

	return claim, nil
}
