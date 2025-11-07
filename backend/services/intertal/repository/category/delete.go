package category

import (
	"fmt"
	"go.uber.org/zap"
)

func (r *CategoryRepository) Delete(id int) error {
	const op = "repository.category.Delete"
	log := r.stg.Log.With(zap.String("op", op))
	db := r.stg.DB

	ctx, cancel := r.getContext()
	defer cancel()

	query := `delete from categorys where id = $1`

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		log.Error(
			op,
			zap.Error(err),
		)
		return fmt.Errorf("%s: %v", op, err.Error())
	}
	defer stmt.Close()

	_, err = stmt.ExecContext(ctx, id)
	if err != nil {
		log.Error(
			op,
			zap.Error(err),
		)
		return fmt.Errorf("%s: %v", op, err.Error())
	}

	return nil
}
