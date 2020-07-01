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
    connection.query("SELECT * FROM department", function (err, results) {
        console.table(results);
        displayMenu();
    });
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, results) {
        console.table(results);
        displayMenu();
    });
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, results) {
        console.table(results);
        displayMenu();
    });
}

function addDepartment() {
    inquirer.prompt({
        type: "input",
        message: "Enter Department Name:",
        name: "dept"
    }).then(function (answer) {
        let query = "INSERT INTO department (name) VALUES ('" + answer.dept + "')";
        connection.query(query, function (err, results) {
            console.log("Department added");
            displayMenu()
        })
    })
}



function addRole() {
    // addEmployee function works/trying to copy it...
//     let departments = [];
//     const departmentResults = [
//         {
//             type: "input",
//             message: "What role are you adding?",
//             name: "title"
//         },
//         {
//             type: "input",
//             message: "What is the salary for this Role?",
//             name: "salary"
//         }
//     ];
//     inquirer.prompt(departmentResults).then(function (response) {
//         connection.query("SELECT * FROM department", function (err, results) {
//             if (err) throw err;
//             for (let i = 0; i < results.length; i++) {
//                 departments.push(results[i].title);
//             }
//         })
//     })
// }
    const departments = [];
    let departmentResults;

    connection.query("SELECT * FROM department", function (err, results) {
        if (err) console.log(err);
        departmentResults = results;
        for (let i = 0; i < results.length; i++) {
            departments.push(results[i].name);
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
            choices: "departments",
            name: "deptSelection"
        }
    ];

    inquirer.prompt(prompt).then(function (response) {
        const deptId = departmentResults.filter(record => {
            return record.name == response.deptSelection;
        });

        let query = "INSERT INTO role (title,salary, department_id) VALUES ('" + response.role + "', '" + response.salary + "', '" + deptId[0].id+ "')";
        connenection.query(query, function (err, result) {
            if (err) console.log(err);
            console.log("New Role Added");
            displayMenu();
        })
    });
}

function addEmployee() {
    let roleList = [];
    const newEmployee = [
        {
            type: "input",
            message: "What is the employee's First Name?",
            name: "firstName"
        },
        {
            type: "input",
            message: "What is the employee's Last Name?",
            name: "lastName"
        }
    ];
    inquirer.prompt(newEmployee).then(function (response) {
        connection.query("SELECT * FROM role", function (err, results) {
            if (err) throw err;
            for (let i = 0; i < results.length; i++) {
                roleList.push(results[i].title);
            }
            inquirer.prompt({
                type: "input",
                name: "newRole",
                message: "What is the role of the new Employee?",
                choices: "roleList"
            }).then(function (answer) {
                let roleId;
                connection.query("SELECT * FROM role WHERE title = '" + answer.newRole + "'", function (err, result) {
                    if (err) throw err;
                    roleId = result[0].id;
                    let query = "INSERT INTO employee (first_name, last_name, role_id) VALUES ('" + response.firstName + "', '" + response.lastName + "', '" + roleId + "')";
                    connection.query(query, function (err, results) {
                    if (err) throw err;
                    console.log("Added New Employee");
                    displayMenu(); 
                    });
                });
            });
        });
    });
}

function updateEmployee() {
    const employee = [];
    const role = [];
    const employeeUpdate = [
        {
            type: "list",
            message: "Which Employee would you like to update?",
            choices: employee,
            name: "updateE"
        },
        {
            type: "list",
            message: "What is their new role?",
            choices: role,
            name: "roleC"
        }
    ];
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            role.push(results[i].title);
        }
    });
    connection.query("SELECT * FROM employee", function (err, result) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            employee.push(results[i].first_name + " " + result[i].last_name);
        }
        inquirer.prompt(employeeUpdate).then(function (response) {
            const employeeName = response.updateE.split(" ");
            let roleId;
            connection.query("SELECT * FROM role WHERE title = '" + response.roleC + "'", function (err, results) {
                if (err) throw err;
                roleId = results[0].id;
                let query = "UPDATE employee SET role_id = '" + roleId + "' WHERE first_name = '" + employeeName[0] + "' AND last_name = '" + employeeName[1] + "')";
                connection.query(query, function (err, results) {
                    console.log(results.affectedRows + "record's updated");
                    displayMenu();
                });
            });
        })
    })
}
