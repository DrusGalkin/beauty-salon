package repository

import (
	"context"
	"fmt"
	"github.com/DrusGalkin/auth-service-grpc/internal/domain/models"
	"github.com/DrusGalkin/auth-service-grpc/pkg/lib/bcrypt"
	"go.uber.org/zap"
	"time"
)

const ERR_ID = -1

func (a *AuthRepository) Register(ctx context.Context, user models.User) (int, error) {
	const op = "repository.Register"
	log := a.Log.With(zap.String("op", op))

	query := `
			insert into 
			    users 
			    	(name, email, password, created_at) 
				values 
					($1, $2, $3, $4)`

	stmt, err := a.Str.PDB.PrepareContext(ctx, query)
	if err != nil {
		msg := fmt.Errorf("Ошибка при выполнении регистрации: %v", err)
		log.Error(msg.Error())
		return ERR_ID, msg
	}
	defer stmt.Close()

	hashPass, err := bcrypt.Hash(user.Password)
	if err != nil {
		return ERR_ID, fmt.Errorf("%s: %v", op, err)
	}

	_, err = stmt.ExecContext(
		ctx,
		user.Name,
		user.Email,
		hashPass,
		time.Now(),
	)

	if err != nil {
		msg := fmt.Errorf("Ошибка при выполнении регистрации: %v", err)
		log.Error(msg.Error())
		return ERR_ID, msg
	}

	return ERR_ID, nil
}
