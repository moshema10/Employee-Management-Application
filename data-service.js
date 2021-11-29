// const fs = require("fs");
// var employees_array = [];
// var departments_array = [];

//remove all of the code and replace it with a return call to an 
//"empty" promise that invokes reject()


const Sequelize = require('sequelize');

var sequelize = new Sequelize("dfq90knjkss5kd", "bvbantskmnhbem", "a440c0a2028c777848b93eff4a7c55add674befc55b2bb3e3a4f926c719937b8", 
{
    host: "ec2-23-23-219-25.compute-1.amazonaws.com",
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
    } 
   });

sequelize.authenticate().then(()=> console.log('Connection success.')).catch((err)=>console.log("Unable to connect to DB.", err));

module.exports.initialize = function()
{
    return new Promise(function (resolve, reject) {
        reject();
       });
}


module.exports.getAllEmployees = function()
{
    return new Promise(function (resolve, reject) {
        reject();
       });
}


module.exports.getDepartments = function()
{
    return new Promise(function (resolve, reject) {
        reject();
       });
}

module.exports.getManagers = function()
{
    return new Promise(function (resolve, reject) {
        reject();
       });
}

module.exports.addEmployee = function(employeeData)
{
    return new Promise(function (resolve, reject) {
        reject();
       });
}

module.exports.getEmployeesByStatus = function(status)
{
    return new Promise(function (resolve, reject) {
        reject();
       });
}

module.exports.getEmployeesByDepartment= function(department)
{
    return new Promise(function (resolve, reject) {
        reject();
       });
}