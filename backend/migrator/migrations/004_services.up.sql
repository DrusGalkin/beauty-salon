create table services
(
    id          serial primary key,
    title       varchar(120)  not null unique,
    price       integer       not null,
    description varchar(1000) not null,
    category_id integer,
    foreign key (category_id)
        references categorys (id)
        on delete cascade
);