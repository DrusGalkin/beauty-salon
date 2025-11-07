package category

func (r *CategoryUseCase) Delete(id int) error {
	return r.repo.Delete(id)
}
