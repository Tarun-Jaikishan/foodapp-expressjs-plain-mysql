create table products (
	id int unsigned primary key auto_increment,
    restaurant_id int unsigned not null,
	name varchar(30) not null,
    price int unsigned not null,
    product_image varchar(255) not null,
    description varchar(100) default(""),
    
    foreign key (restaurant_id) references restaurants(id)
);