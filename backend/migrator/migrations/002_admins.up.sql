create table admins
(
    user_id integer primary key,
    role    varchar(5) not null,
    foreign key (user_id)
        references users (id)
        on delete cascade
);

insert into admins values(1, 'admin');