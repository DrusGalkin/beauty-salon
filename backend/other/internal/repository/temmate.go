package repository

import (
	"fmt"
	"go.uber.org/zap"
	"other/internal/domains/models"
)

func (o *OtherRepository) GetAllTeammate() ([]models.TeammateDTO, error) {
	const op = "repository.GetAllTeammate"
	log := o.log.With(zap.String("op", op))

	ctx, cancel := o.getContext()
	defer cancel()

	query := `	select 
					t.id, t.full_name, t.tag, tp.url as url
				from 
					teammate t
				inner join teammate_photo tp on t.photo_id = tp.id   	
				order by id desc`

	rows, err := o.db.QueryContext(ctx, query)
	if err != nil {
		log.Error(
			"failed to get teammates",
			zap.Error(err),
		)
		return nil, fmt.Errorf("%s: %v", op, err)
	}
	defer rows.Close()

	var teammates []models.TeammateDTO
	for rows.Next() {
		var teammate models.TeammateDTO
		err := rows.Scan(
			&teammate.ID,
			&teammate.FullName,
			&teammate.Tag,
			&teammate.Url,
		)
		if err != nil {
			log.Error(
				"failed to scan teammate",
				zap.Error(err),
			)
			return nil, fmt.Errorf("%s: %v", op, err)
		}
		teammates = append(teammates, teammate)
	}

	if err = rows.Err(); err != nil {
		log.Error(
			"error during rows iteration",
			zap.Error(err),
		)
		return nil, fmt.Errorf("%s: %v", op, err)
	}

	return teammates, nil
}

func (o *OtherRepository) CreateTeammate(teammate models.Teammate) (int, error) {
	const op = "repository.CreateTeammate"
	log := o.log.With(zap.String("op", op))

	ctx, cancel := o.getContext()
	defer cancel()

	query := `INSERT INTO teammate (full_name, tag, photo_id) VALUES ($1, $2, $3) RETURNING id`

	var id int
	err := o.db.QueryRowContext(ctx, query, teammate.FullName, teammate.Tag, teammate.PhotoID).Scan(&id)
	if err != nil {
		log.Error(
			"failed to create teammate",
			zap.Error(err),
			zap.String("full_name", teammate.FullName),
			zap.String("tag", teammate.Tag),
			zap.Int("photo_id", teammate.PhotoID),
		)
		return 0, fmt.Errorf("%s: %v", op, err)
	}

	return id, nil
}

func (o *OtherRepository) UpdateTeammate(id int, teammate models.Teammate) error {
	const op = "repository.UpdateTeammate"
	log := o.log.With(zap.String("op", op))

	ctx, cancel := o.getContext()
	defer cancel()

	query := `UPDATE teammate SET full_name = $1, tag = $2, photo_id = $3 WHERE id = $4`

	result, err := o.db.ExecContext(ctx, query, teammate.FullName, teammate.Tag, teammate.PhotoID, id)
	if err != nil {
		log.Error(
			"failed to update teammate",
			zap.Error(err),
			zap.Int("id", id),
		)
		return fmt.Errorf("%s: %v", op, err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Error(
			"failed to get rows affected",
			zap.Error(err),
		)
		return fmt.Errorf("%s: %v", op, err)
	}

	if rowsAffected == 0 {
		log.Warn(
			"teammate not found for update",
			zap.Int("id", id),
		)
		return fmt.Errorf("%s: teammate with id %d not found", op, id)
	}

	return nil
}

func (o *OtherRepository) DeleteTeammate(id int) error {
	const op = "repository.DeleteTeammate"
	log := o.log.With(zap.String("op", op))

	ctx, cancel := o.getContext()
	defer cancel()

	query := `DELETE FROM teammate WHERE id = $1`

	result, err := o.db.ExecContext(ctx, query, id)
	if err != nil {
		log.Error(
			"failed to delete teammate",
			zap.Error(err),
			zap.Int("id", id),
		)
		return fmt.Errorf("%s: %v", op, err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Error(
			"failed to get rows affected",
			zap.Error(err),
		)
		return fmt.Errorf("%s: %v", op, err)
	}

	if rowsAffected == 0 {
		log.Warn(
			"teammate not found for deletion",
			zap.Int("id", id),
		)
		return fmt.Errorf("%s: teammate with id %d not found", op, id)
	}

	return nil
}
