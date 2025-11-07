package repository

import (
	"fmt"
	"go.uber.org/zap"
)

func (r *UserRepository) Delete(id int) error {
	const op = "repository.Delete"
	log := r.log.With(zap.String("op", op))
	db := r.str.PBD

	ctx, cancel := r.getContext()
	defer cancel()

	query := `delete from users where id = $1`

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		log.Error(op + ": " + err.Error())
		return QueryError
	}
	defer stmt.Close()
	
	result, err := stmt.ExecContext(ctx, id)
	if err != nil {
		log.Error(op + ": " + err.Error())
		return fmt.Errorf("%s: %v", op, err)
	}

	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if affected == 0 {
		return NotFound
	}

	return nil
}
