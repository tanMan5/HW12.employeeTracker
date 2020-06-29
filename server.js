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

function displayMenu() {
    inquirer.prompt({
        type: "list",
        name: "choice",
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
        ]        
    }).then(function (answer) {
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
            };
        });
};

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, result) {
        console.table(result);
        displayMenu();
    });
}

function viewRoles() {
    connection.query("SELECT * FROM roles", function (err, result) {
        console.table(result);
        displayMenu();
    });
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, result) {
        console.table(result);
        displayMenu();
    });
}

function addDepartment() {
    inquirer.prompt({
        type: "input",
        message: "Enter Department Name:",
        name: "dept"
    }).then(function(answer) {
        let query = "INSERT INTO department SET ?";
        connection.query(query, function (err, result) {
            console.log("Department added");
            displayMenu()
        })
    })
}

function addRole() {
    let departments = [];
    let departmentResults;

    connection.query("SELECT * FROM department", function (err, result) {
        if (err) console.log(err);
        departmentResults = result;
        for (let i = 0; i < result.length; i++) {
            departments.push(result[i].dept_name);
        }
    })
    let prompt = [
        {
        type: "input",
        message: "What role are you adding?",
        name: "role"
    },
    {
        type: "input",
        message: "What is the salary?",
        name: "salary"
    },
    {
        type: "list",
        message: "What is the department?",
        choices: departments,
        name: "deptSelection"
    }
    ];

    inquirer.prompt(prompts).then(function (response) {
        const deptId = departmentResults.filter(record => {
            return record.dept_name === response.deptSelection;
        });

        let query = "INSERT INTO role (title,salary, department_id) VALUES ('" + response.role + "', '" +ressponse.salary + "', '" + deptId[0].id + "')";
        connenection.query(query, function (err, result) {
            if (err) console.log(err);
            console.log("New Role Added");
            displayMenu();
        })
    });
}

