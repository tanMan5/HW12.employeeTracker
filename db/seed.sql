DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE role(
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL,
department_id INT,
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id)
);




INSERT INTO role (title, salary) values ('Sales Lead', 110000);
INSERT INTO role (title, salary) values ('Sales Person', 60000);
INSERT INTO role (title, salary) values ('Lead Engineer', 210000);
INSERT INTO role (title, salary) values ('Software Engineer', 150000);
INSERT INTO role (title, salary) values ('Accounting Lead', 110000);
INSERT INTO role (title, salary) values ('Accountant', 60000);
INSERT INTO role (title, salary) values ('Legal Team Lead', 250000);
INSERT INTO role (title, salary) values ('Lawyer', 125000);