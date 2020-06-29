DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)    
);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT  NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee(
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (id)  
);

INSERT INTO role (title, salary) values ("Sales Lead", 100000);
INSERT INTO role (title, salary) values ("Sales Person", 80000);
INSERT INTO role (title, salary) values ("Lead Engineer", 250000);
INSERT INTO role (title, salary) values ("Software Engineer", 150000);
INSERT INTO role (title, salary) values ("Accounting lead", 180000);
INSERT INTO role (title, salary) values ("Accountant", 100000);
INSERT INTO role (title, salary) values ("Legal Team Lead", 150000);
INSERT INTO role (title, salary) values ("Lawyer", 125000);