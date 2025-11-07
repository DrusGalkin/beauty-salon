create table reviews
(
    id         serial primary key,
    user_id    integer not null,
    service_id integer not null,
    content    text    not null,
    rating     integer not null,
    foreign key (user_id)
        references users (id)
        on delete cascade,
    foreign key (service_id)
        references services (id)
        on delete cascade
);