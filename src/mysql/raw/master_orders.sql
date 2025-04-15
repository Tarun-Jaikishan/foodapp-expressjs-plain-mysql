create table master_orders (
	id int unsigned primary key auto_increment,
    uuid UUID NOT NULL,
    user_id int unsigned not null,

    -- address details
    house_number varchar(10) default(""),
    street_name varchar(20) default(""),
    state_name varchar(30) default(""),
    city_name varchar(30) default(""),
    pincode varchar(6) default(""),

    foreign key (user_id) references users(id),


);
