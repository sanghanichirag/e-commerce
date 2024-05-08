const mysql = require('mysql');

let create = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'product_management'
});
// Video_calling
create.connect((err) => {
  if (err) {
    console.log('db not connect !!');
  } else {
    console.log('db Connected.');
  }
})


// Admin Table Query
create.query(`CREATE TABLE IF NOT EXISTS admin (
    id int NOT NULL AUTO_INCREMENT,
    username varchar(50) DEFAULT NULL,
    email varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    phone varchar(10) DEFAULT NULL,
    profile_image varchar(255) DEFAULT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    auth_token varchar(555) DEFAULT NULL,
    otp varchar(20) DEFAULT NULL,
    PRIMARY KEY (id)
  ) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;`);

// User Table Query 
create.query(`CREATE TABLE IF NOT EXISTS user (
    id int NOT NULL AUTO_INCREMENT,
    username varchar(50) DEFAULT NULL,
    phone varchar(10) NOT NULL,
    email varchar(100) NOT NULL,
    image varchar(9999) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    password varchar(100) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    auth_token varchar(555) DEFAULT NULL,
    otp varchar(20) DEFAULT NULL,
    PRIMARY KEY (id)
  ) ENGINE=MyISAM AUTO_INCREMENT=1035 DEFAULT CHARSET=utf8mb3;`)

//  Product Table Query
create.query(`CREATE TABLE IF NOT EXISTS product (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    price varchar(255) NOT NULL,
    quantity int NOT NULL,
    images longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
    description varchar(9999) NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  ) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COMMENT='9';`);

// Cart Table Query
create.query(`CREATE TABLE IF NOT EXISTS cart (
  id int NOT NULL AUTO_INCREMENT,
  user_id varchar(10) NOT NULL,
  product_id varchar(10) NOT NULL,
  quantity varchar(10) CHARACTER SET utf8mb4 NOT NULL DEFAULT '1',
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;`);

// Check Out Query
create.query(`CREATE TABLE IF NOT EXISTS orders (
  id int NOT NULL AUTO_INCREMENT,
  user_id int(11) NOT NULL,
  order_id varchar(255) NOT NULL,
  status varchar(255) NOT NULL DEFAULT 'Pending',
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  apartment varchar(255) DEFAULT NULL,
  address varchar(255) NOT NULL,
  phone varchar(255) NOT NULL,
  city varchar(255) NOT NULL,
  state varchar(255) NOT NULL,
  country varchar(255) NOT NULL,
  zip_code varchar(255) NOT NULL,
  total decimal(65,4) NOT NULL,
  shippingCharge decimal(65,4) NOT NULL,
  created_at datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`);

// Order List Table Query
create.query(`CREATE TABLE IF NOT EXISTS  order_list  (
  id int NOT NULL AUTO_INCREMENT,
  order_id varchar(255) NOT NULL,
  product_id varchar(10) NOT NULL,
  qty varchar(10) NOT NULL,
  created_at datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;`)

module.exports = create;