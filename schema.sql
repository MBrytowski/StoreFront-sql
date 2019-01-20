DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(50) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Whirly-gig", "Music", 5.00, 9), ("Thing-a-ma-jig", "Home", 10.00, 120), ("Pillow", "Home", 3.00, 100), (), (),
(), (), (), (), ();

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Laptop", "Electronics", 500.00, 12), ("Couch", "Home", 200.00, 5), ("Crockpot", "Kitchen", 95.00, 15), 
("Lamp Set of 2", "Home", 65.00, 23), ("Yamaha Keyboard", "Music", 130.00, 6);