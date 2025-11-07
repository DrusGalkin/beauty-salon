package service

func (r *ServiceUseCase) Delete(id int) error {
	return r.repo.Delete(id)
}
