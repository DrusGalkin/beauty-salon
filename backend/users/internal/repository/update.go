package repository

import (
	"fmt"
	"go.uber.org/zap"
	"users/internal/domain/models"
)

func (r *UserRepository) Update(id int, data models.User) error {
	const op = "repository.Update"
	log := r.log.With(zap.String("op", op))
	db := r.str.PBD

	ctx, cancel := r.getContext()
	defer cancel()

	query := `update users
			  set 
			  name = $1,
			  email = $2, 
			  password = $3,
			  created_at = $4
			  where id = $5`

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		log.Error(err.Error())
		return fmt.Errorf("%v: %v", QueryError, err)
	}
	defer stmt.Close()

	result, err := stmt.ExecContext(
		ctx,
		data.Name,
		data.Email,
		data.Password,
		data.CreatedAt,
		id,
	)
	if err != nil {
		log.Error(QueryError.Error() + ": " + "Ошибка выполнения запроса на изменение данных")
		return fmt.Errorf("%v: %v", QueryError, err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Error(NotFound.Error() + ": " + "Ошибка при изменении пользователя")
		return fmt.Errorf("%v: %v", NotFound, err)
	}

	if rowsAffected == 0 {
		log.Error(NotFound.Error() + ": " + "Ошибка при изменении пользователя")
		return fmt.Errorf("%v: %v", NotFound, err)
	}

	return nil
}
