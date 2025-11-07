package repository

import (
	"fmt"
	"go.uber.org/zap"
	"users/internal/domain/models"
)

func (r *UserRepository) GetAll() ([]models.User, error) {
	const op = "repository.GetAll"
	log := r.log.With(zap.String("op", op))
	db := r.str.PBD

	ctx, cancel := r.getContext()
	defer cancel()

	query := `select id, name, email, created_at 
			  from users`

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		log.Error(op + ": " + err.Error())
		return nil, fmt.Errorf("%s: %v", op, QueryError)
	}
	defer stmt.Close()

	var users []models.User
	rows, err := stmt.QueryContext(ctx)
	if err != nil {
		log.Error(op + ": " + err.Error())
		return nil, fmt.Errorf("%s: %v", op, QueryError)
	}

	for rows.Next() {
		var user models.User
		if err = rows.Scan(
			&user.ID,
			&user.Name,
			&user.Email,
			&user.CreatedAt,
		); err != nil {
			log.Error(op + ": " + err.Error())
			return nil, fmt.Errorf("%s: %v", op, NotFound)
		}
		users = append(users, user)
	}

	return users, nil
}
