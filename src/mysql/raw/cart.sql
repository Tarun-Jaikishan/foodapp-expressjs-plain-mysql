create table cart (
	id int unsigned primary key auto_increment,
	user_id int unsigned not null,
    restaurant_id int unsigned not null,
    product_id int unsigned not null,
    qty int unsigned not null default(1),
    
    foreign key (user_id) references users(id),
    foreign key (restaurant_id) references restaurants(id),
    foreign key (product_id) references products(id)
);
