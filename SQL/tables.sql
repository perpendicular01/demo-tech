create table cpu_details(
    productName varchar(100),
    baseFreq int,
    maxFreq int,
    cores int,
    threads int,
    tdp int,
    type varchar(10),
    image varchar(200),
    constraint pk_cpu_details primary key (productName)
);

create table cpu_shop(
    productName varchar(100),
    price int not null,
    warranty int,
    shop varchar(10),
    link varchar(250),
    constraint pk_cpu_shop primary key (productName,shop)
);

create table gpu_details(
    productName varchar(100),
    type varchar(10),
    size int,
    image varchar(200),
    description varchar(1000),
    constraint pk_gpu_details primary key (productName)
);

create table gpu_shop(
    productName varchar(100),
    price int not null,
    warranty int,
    shop varchar(10),
    link varchar(250),
    constraint pk_gpu_shop primary key (productName,shop)
);

create table monitor_details(
    productName varchar(100),
    resolution varchar(20),
    displaySize int,
    panelType varchar(5),
    image varchar(200),
    description varchar(1000),
    constraint pk_gpu_details primary key (productName)
);

create table monitor_shop(
    productName varchar(100),
    price int not null,
    warranty int,
    shop varchar(10),
    link varchar(250),
    constraint pk_gpu_shop primary key (productName,shop)
);

create table ram_details(
    productName varchar(100),
    type varchar(5),
    capacity int,
    frequency int,
    latency varchar(30),
    image varchar(200),
    constraint pk_ram_details primary key (productName)
);

create table ram_shop(
    productName varchar(100),
    price int not null,
    warranty int,
    shop varchar(10),
    link varchar(250),
    constraint pk_ram_shop primary key (productName,shop)
);

create table promo_code(
    code varchar(30) not null,
    percentage int not null,
    constraint pk_promo_code primary key(code)
);
