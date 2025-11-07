create table about
(
    id          serial primary key,
    title       varchar(120) not null,
    description text         not null
);

insert into about(title, description) values ('Привет!', 'Тут будет подробное описание как все есть');