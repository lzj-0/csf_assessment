-- IMPORTANT: DO NOT CHANGE THE GIVEN SCHEMA UNLESS YOU HAVE A GOOD REASON
-- IF YOU DO CHANGE IT WRITE THE JUSTIFICATION IN A COMMENT ABOVE THE CHANGE

drop database if exists restaurant;

create database restaurant;

use restaurant;

create table customers (
-- if username from place_orders should exist in customer's table, place_orders username column is a foreign key to customers username, thus username in customers table has to be a primary key
  username varchar(64) not null primary key,
  password varchar(128) not null
);

insert into customers(username, password) values
  ('fred', sha2('fred', 224)),
  ('barney', sha2('barney', 224)),
  ('wilma', sha2('wilma', 224)),
  ('betty', sha2('betty', 224)),
  ('pebbles', sha2('pebbles', 224));

-- TODO: Task 1.2
-- Write your task 1.2 below
create table place_orders (
  order_id char(8) primary key,
  payment_id varchar(128) unique not null,
  order_date date not null,
  total decimal(8, 2) not null,
  username varchar(64) not null,

  constraint fk_username foreign key(username) references customers(username),
  constraint chk_total check(total between 0.00 and 999999.99)
);
