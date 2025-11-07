package category

import (
	"fmt"
	"go.uber.org/zap"
	"services/intertal/domains/models"
)

func (r *CategoryRepository) Update(id int, category models.Category) error {
	const op = "repository.category.Update"
	log := r.stg.Log.With(zap.String("op", op))
	db := r.stg.DB

	ctx, cancel := r.getContext()
	defer cancel()

	query := `update categorys set title=$1 where id=$2`

	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		log.Error(
			op,
			zap.Error(err),
		)
		return fmt.Errorf("%s: %v", op, err.Error())
	}
	defer stmt.Close()

	_, err = stmt.ExecContext(ctx, category.Title, id)
	if err != nil {
		log.Error(
			op,
			zap.Error(err),
		)
		return fmt.Errorf("%s: %v", op, err.Error())
	}

	return nil
}
