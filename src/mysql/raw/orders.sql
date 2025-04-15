create table orders (
	id int unsigned primary key auto_increment,
	uuid UUID NOT NULL,

    restaurant_id int not null,
    product_id int not null,
    qty int UNSIGNED not null default(1),

    foreign key (uuid) references master_orders(uuid),
    foreign key (restaurant_id) references restaurants(id),
    foreign key (product_id) references products(id)
);
