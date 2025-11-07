create table teammate
(
    id        serial primary key,
    full_name varchar(150) not null,
    tag       varchar(100) not null,
    photo_id  integer,
    foreign key (photo_id)
        references
            teammate_photo (id)
        on delete cascade
);

