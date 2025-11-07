CREATE TABLE users
(
    id         serial primary key,
    name       varchar(100) not null,
    email      varchar(100) not null unique,
    password   varchar(250) not null,
    created_at date         not null
);

INSERT INTO users(name, email, password, created_at)
VALUES ('admin', '22a@a.com', '$2a$10$cbia5fwowbDwgYjj1y3M0e01ZIsdNr53Xjv3kzk/xK2kXV8ODp29G', CURRENT_DATE);