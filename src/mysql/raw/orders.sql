create table orders (
	id int unsigned primary key auto_increment,
	uuid char(36) not null,

    restaurant_id int unsigned not null,
    product_id int unsigned not null,
    qty int unsigned not null default(1),

    foreign key (uuid) references master_orders(uuid),
    foreign key (restaurant_id) references restaurants(id),
    foreign key (product_id) references products(id)
);
