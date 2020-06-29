const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Baseball5!",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
    console.log("connection id", connection.threadId);
    displayMenu()
});

Function displayMenu() {
    inquirer.prompt({
        type: "list",
        message: "Please Select One:",
        choices: [
            "View all Departments", 
            "View all Roles", 
            "View all Employees", 
            "Add a Department", 
            "Add a Role", 
            "Add an Employee",
            "Update Employee Role",
            "Exit"
        ],
        name: "choice"        
    })
    .then(function(answer) {
        switch (answer.choice) {
            case "View all Departments":
                viewDepartments();
                break;
                case "View all Roles":
                    viewRoles();
                    break;
                    case "View all Employees":
                        viewEmployees();
                        break;
                        case "Add a Department":
                            addDepartment();
                            break;
                            case "Add a role":
                                addRole();
                                break;
                                case "Add an Employee":
                                    addEmployee();
                                    break;
                                    case "Update Employee Role":
                                        updateEmployee();
                                        break;
                                        case "Exit":
                                            connection.end();                                    
        }
    });
}
