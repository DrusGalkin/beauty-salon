package jwt

import (
	"fmt"
	"github.com/DrusGalkin/auth-service-grpc/internal/domain/models"
	"github.com/dgrijalva/jwt-go"
)

func (a *JWT) Refresh(tokenStr string) (*models.Tokens, error) {
	claim := &Claim{}

	token, err := jwt.ParseWithClaims(tokenStr, claim, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, fmt.Errorf("%v: %v", ErrParseToken, err)
	}

	if !token.Valid {
		return nil, ErrInvalidToken
	}

	tokens, err := a.GenerateTokens(
		models.User{
			ID:    claim.ID,
			Email: claim.Email,
		},
	)

	if err != nil {
		return nil, err
	}

	return &tokens, nil
}
