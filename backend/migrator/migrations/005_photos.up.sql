CREATE TABLE photos
(
    id         SERIAL PRIMARY KEY,
    url        TEXT    NOT NULL,
    index      INTEGER NOT NULL,
    service_id INTEGER NOT null,
    foreign key (service_id) references services (id)
        on delete cascade
);