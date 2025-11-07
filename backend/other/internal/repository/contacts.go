package repository

import (
	"fmt"
	"go.uber.org/zap"
	"other/internal/domains/models"
)

func (o *OtherRepository) GetAllContacts() ([]models.Contact, error) {
	const op = "repository.GetAllContacts"
	log := o.log.With(zap.String("op", op))

	ctx, cancel := o.getContext()
	defer cancel()

	query := `SELECT id, title, contacts FROM contact ORDER BY id`

	rows, err := o.db.QueryContext(ctx, query)
	if err != nil {
		log.Error(
			"failed to get contacts",
			zap.Error(err),
		)
		return nil, fmt.Errorf("%s: %v", op, err)
	}
	defer rows.Close()

	var contacts []models.Contact
	for rows.Next() {
		var contact models.Contact
		err := rows.Scan(
			&contact.ID,
			&contact.Title,
			&contact.Contacts,
		)
		if err != nil {
			log.Error(
				"failed to scan contact",
				zap.Error(err),
			)
			return nil, fmt.Errorf("%s: %v", op, err)
		}
		contacts = append(contacts, contact)
	}

	if err = rows.Err(); err != nil {
		log.Error(
			"error during rows iteration",
			zap.Error(err),
		)
		return nil, fmt.Errorf("%s: %v", op, err)
	}

	return contacts, nil
}

func (o *OtherRepository) CreateContact(contact models.Contact) error {
	const op = "repository.CreateContact"
	log := o.log.With(zap.String("op", op))

	ctx, cancel := o.getContext()
	defer cancel()

	query := `INSERT INTO contact (title, contacts) VALUES ($1, $2) RETURNING id`

	var id int
	err := o.db.QueryRowContext(ctx, query, contact.Title, contact.Contacts).Scan(&id)
	if err != nil {
		log.Error(
			"failed to create contact",
			zap.Error(err),
			zap.String("title", contact.Title),
		)
		return fmt.Errorf("%s: %v", op, err)
	}

	return nil
}

func (o *OtherRepository) UpdateContact(contact models.Contact) error {
	const op = "repository.UpdateContact"
	log := o.log.With(zap.String("op", op))

	ctx, cancel := o.getContext()
	defer cancel()

	query := `UPDATE contact SET title = $1, contacts = $2 WHERE id = $3`

	result, err := o.db.ExecContext(ctx, query, contact.Title, contact.Contacts, contact.ID)
	if err != nil {
		log.Error(
			"failed to update contact",
			zap.Error(err),
			zap.Int("id", contact.ID),
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
			"contact not found for update",
			zap.Int("id", contact.ID),
		)
		return fmt.Errorf("%s: contact with id %d not found", op, contact.ID)
	}

	return nil
}

func (o *OtherRepository) DeleteContact(contact models.Contact) error {
	const op = "repository.DeleteContact"
	log := o.log.With(zap.String("op", op))

	ctx, cancel := o.getContext()
	defer cancel()

	query := `DELETE FROM contact WHERE id = $1`

	result, err := o.db.ExecContext(ctx, query, contact.ID)
	if err != nil {
		log.Error(
			"failed to delete contact",
			zap.Error(err),
			zap.Int("id", contact.ID),
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
			"contact not found for deletion",
			zap.Int("id", contact.ID),
		)
		return fmt.Errorf("%s: contact with id %d not found", op, contact.ID)
	}

	return nil
}
