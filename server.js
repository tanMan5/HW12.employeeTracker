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
    connection.query("SELECT department.name, department.id FROM department", function (err, results) {
        console.table(results);
        displayMenu();
    });
}

function viewRoles() {
    connection.query("SELECT role.title, role.id FROM role", function (err, results) {
        console.table(results);
        displayMenu();
    });
}

function viewEmployees() {
    connection.query("SELECT first_name, last_name, role.title, role.salary, department.name FROM employee INNER JOIN role ON ROLE.ID = employee.role_id INNER JOIN department ON role.department_id = department.id", function (err, results) {
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
        connection.query("INSERT INTO department SET ?",
            {
                name: answer.dept
            }, function (err, results) {
                console.log("Department added");
                displayMenu()
            })
    })
}



function addRole() {
    // addEmployee function works/trying to copy it...
    connection.query('SELECT department.name, department.id FROM department', function (err, results) {
        let deptName = [];
        let deptId = [];
        for (let i = 0; i < results.length; i++) {
            deptName.push(`${results[i].name}`);
            deptId.push(results[i].id);
        }
        inquirer
            .prompt([
                {
                    name: "role",
                    type: "input",
                    message: "What role are you adding?"                    
                },
                {                    
                    name: "salary",
                    type: "input",
                    message: "What is the salary for this Role?"                    
                },
                {
                    name: "department",
                    type: "list",
                    message: "What department is the role under?",
                    choices: deptName
                }
            ]).then(function (answer) {
                let newdept = answer.department;
                let deptInd = deptName.indexOf(newdept);
                connection.query("INSERT INTO role SET ?",
                    {
                        title: answer.role,
                        salary: answer.salary,
                        department_id: deptId[deptInd]
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("The role was added.");
                        displayMenu()
                    });
            });
    });
}
//     let departments = [];
//     const departmentResults = [
// //         {
// //             type: "input",
// //             message: "What role are you adding?",
// //             name: "role"
// //         },
// //         {
// //             type: "input",
// //             message: "What is the salary for this Role?",
// //             name: "salary"
// //         }
// //     ];
// //     inquirer.prompt(departmentResults).then(function (response) {
// //         connection.query("SELECT * FROM department", function (err, results) {
// //             if (err) throw err;
// //             for (let i = 0; i < results.length; i++) {
// //                 departments.push(results[i].title);
// //             }
// //         })
// //     })
// // }
// //     const departments = [];
// //     let departmentResults;

// //     connection.query("SELECT * FROM department", function (err, results) {
// //         if (err) console.log(err);
// //         departmentResults = results;
// //         for (let i = 0; i < results.length; i++) {
// //             departments.push(results[i].name);
// //         }
// //     })
// //     let prompt = [
// //         {
// //             type: "input",
// //             message: "What role are you adding?",
// //             name: "role"
// //         },
// //         {
// //             type: "input",
// //             message: "What is the salary?",
// //             name: "salary"
// //         },
// //         {
// //             type: "list",
// //             message: "What is the department?",
// //             choices: "departments",
// //             name: "deptSelection"
// //         }
// //     ];

// //     inquirer.prompt(prompt).then(function (response) {
// //         const deptId = departmentResults.filter(record => {
// //             return record.name == response.deptSelection;
// //         });

// //         let query = "INSERT INTO role (title,salary, department_id) VALUES ('" + response.role + "', '" + response.salary + "', '" + deptId[0].id+ "')";
// //         connenection.query(query, function (err, result) {
// //             if (err) console.log(err);
// //             console.log("New Role Added");
// //             displayMenu();
// //         })
// //     });
// // }

function addEmployee() {
    connection.query("SELECT employee.first_name, employee.last_name, id FROM employee", function (err, results) {
        let employees = [];
        let employId = [];
        for (let i = 0; i < results.length; i++) {
            employees.push(`${results[i].first_name} ${results[i].last_name}`);
            employId.push(results[i].id)
        }
        connection.query("SELECT role.title, role.id FROM role", function (err, results) {
            let roles = [];
            let roleId = [];
            for (let i = 0; i < results.length; i++) {
                roles.push(`${results[i].title}`);
                roleId.push(results[i].id);
            }
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the employee's First Name?",
                    name: "firstName"
                },
                {
                    type: "input",
                    message: "What is the employee's Last Name?",
                    name: "lastName"
                },
                {
                    type: "list",
                    message: "What is the employee's role?",
                    name: "role",
                    choices: roles
                }
            ]).then(function (answer) {
                let newRole = answer.role;
                let roleInd = roles.indexOf(newRole);

                connection.query("INSERT INTO employee SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: roleId[roleInd]
                },
                function (err) {
                    if (err) throw err;
                    console.log("The employee was added.");
                    displayMenu()
                });
            
            });
        });
    });
}
    // let roleList = [];
    // const newEmployee = [
    //     {
    //         type: "input",
    //         message: "What is the employee's First Name?",
    //         name: "firstName"
    //     },
    //     {
    //         type: "input",
    //         message: "What is the employee's Last Name?",
    //         name: "lastName"
    //     }
    // ];
    // inquirer.prompt(newEmployee).then(function (response) {
    //     connection.query("SELECT * FROM role", function (err, results) {
    //         if (err) throw err;
    //         for (let i = 0; i < results.length; i++) {
    //             roleList.push(results[i].title);
    //         }
    //         inquirer.prompt({
    //             type: "input",
    //             name: "newRole",
    //             message: "What is the role of the new Employee?",
    //             choices: "roleList"
    //         }).then(function (answer) {
    //             let roleId;
    //             connection.query("SELECT * FROM role WHERE title = '" + answer.newRole + "'", function (err, result) {
    //                 if (err) throw err;
    //                 roleId = result[0].id;
    //                 let query = "INSERT INTO employee (first_name, last_name, role_id) VALUES ('" + response.firstName + "', '" + response.lastName + "', '" + roleId + "')";
    //                 connection.query(query, function (err, results) {
    //                     if (err) throw err;
    //                     console.log("Added New Employee");
    //                     displayMenu();
    //                 });
    //             });
    //         });
    //     });
    // });


function updateEmployee() {
    connection.query("SELECT employee.first_name, employee.last_name FROM employee", function (err, results) {
        let employees = [];
        for (let i = 0; i < results.length; i++) {
            employees.push(`${results[i].first_name} ${results[i].last_name}`)
        }
        connection.query("SELECT role.title, role.id FROM role", function (err, results) {
            let roles = [];
            let roleId = []; 
            for (let i = 0; i < results.length; i++) {
                roles.push(`${results[i].title}`);
                roleId.push(results[i].id);
            }
            inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which Employee would you like to update?",
                    choices: employees,
                    name: "updateE"
                     
                },
                {
                    type: "list",
                    message: "What is their new role?",
                    choices: roles,
                    name: "roleC"
                }
            ]).then(function (answer) {
                let name = answer.updateE.split(" ");
                let newrole = answer.roleC;
                let roleInd = roles.indexOf(newrole);
                connection.query(`UPDATE employee SET role_id = ${roleId[roleInd]} WHERE first_name = '${name[0]}' AND last_name = '${name[1]}' `, function (err) {
                    if (err) throw err;
                    console.log("The employee has be updated");
                    displayMenu()
                    
                });
            });
        });
    });
}
    // const employee = [];
    // const role = [];
    // const employeeUpdate = [
    //     {
    //         type: "list",
    //         message: "Which Employee would you like to update?",
    //         choices: employee,
    //         name: "updateE"
    //     },
    //     {
    //         type: "list",
    //         message: "What is their new role?",
    //         choices: roles,
    //         name: "roleC"
    //     }
    // ];
    // connection.query("SELECT * FROM role", function (err, results) {
    //     if (err) throw err;
    //     for (let i = 0; i < results.length; i++) {
    //         role.push(results[i].title);
    //     }
    // });
    // connection.query("SELECT * FROM employee", function (err, result) {
    //     if (err) throw err;
    //     for (let i = 0; i < results.length; i++) {
    //         employee.push(results[i].first_name + " " + result[i].last_name);
    //     }
    //     inquirer.prompt(employeeUpdate).then(function (response) {
    //         const employeeName = response.updateE.split(" ");
    //         let roleId;
    //         connection.query("SELECT * FROM role WHERE title = '" + response.roleC + "'", function (err, results) {
    //             if (err) throw err;
    //             roleId = results[0].id;
    //             let query = "UPDATE employee SET role_id = '" + roleId + "' WHERE first_name = '" + employeeName[0] + "' AND last_name = '" + employeeName[1] + "')";
    //             connection.query(query, function (err, results) {
    //                 console.log(results.affectedRows + "record's updated");
    //                 displayMenu();
    //             });
    //         });
    //     })
    // })

