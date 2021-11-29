// const fs = require("fs");
// var employees_array = [];
// var departments_array = [];

//remove all of the code and replace it with a return call to an 
//"empty" promise that invokes reject()


const { where } = require('sequelize');
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


//Check Database Connection
sequelize.authenticate()
.then(()=>
{
    console.log('Connection success.');
})
.catch((err)=>{
    console.log("Unable to connect to DB.", err)
});


//Create Employee Table
var Employee = sequelize.define("Employee",{
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

//Create Department Table
var Department = sequelize.define("Department",{
    departmentId:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
})


module.exports.initialize = function()
{
    return new Promise(function (resolve, reject) {
        sequelize.sync().then((Employee)=>{
            resolve();
        })
        .then((Department)=>{
            resolve();
        })
        .catch((err)=>{
            reject("Unable to sync the database");
        });
        reject("Unable to sync the database");
       })
};


module.exports.getAllEmployees = function()
{
    return new Promise(function (resolve, reject) {

        sequelize.sync().then(function(){
            resolve(Employee.findAll());
        }).catch(function(err){
            reject("no results returned");
        });
        
    })
}


module.exports.getEmployeesByStatus = function(Inputstatus)
{
    return new Promise(function (resolve, reject) {

        sequelize.sync().then(function(){
            var ByStaus = Employee.findAll({
                where:{
                    status: Inputstatus
                }
            });
            resolve(ByStaus);
        }).catch(function(err)
        {
            reject("no results returned");
        });
       })
}

module.exports.getEmployeesByDepartment= function(Inputdepartment)
{
    return new Promise(function (resolve, reject) {

        sequelize.sync.then(function(){
            var ByDept = Employee.findAll({
                where:{
                    department: Inputdepartment
                }
            });
            resolve(ByDept);
        }).catch(function(err){
            reject("no results returned");
        });
       })
}

module.exports.getEmployeesByManager = function(Inputmanager)
{
    return new Promise(function(resolve,reject){
        sequelize.sync.then(function(){
            var Bymanager = Employee.findAll({
                where: {
                    employeeManagerNum: Inputmanager
                }
            });
            resolve(Bymanager);
        }).catch(function(err){
            reject("no results returned");
        });
    })
}


module.exports.getEmployeeByNum = function(empNumber)
{
    return new Promise(function(resolve,reject){
        sequelize.sync.then(function(){
            ByempNum = Employee.findAll({
                where:{
                    employeeNum: empNumber
                }
            });
            resolve(ByempNum);
        }).catch(function(err){
            reject("no results returned");
        })
    })
}


module.exports.getDepartments = function()
{
    return new Promise(function (resolve, reject) {

        sequelize.sync().then(function(){
            resolve(Department.findAll());
        }).catch(function(err){
            reject("no results returned");
        });

    });
}

module.exports.getManagers = function()
{
    return new Promise(function (resolve, reject) {

        sequelize.sync().then(function(){
            sequelize.sync.then(function(){
                resolve(Employee.findAll({where:{isManager:true}}));
            }).catch(function(err){
                reject("no results returned");
            })
        });

       });
}

module.exports.addEmployee = function(employeeData)
{
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (let i in employeeData)
        {
            if (employeeData[i] == "")
            {
                employeeData[i] == null;
            }
        }

        sequelize.sync().then(function(){
            resolve(Employee.create({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            }));

        }).catch(function(err){
            reject("unable to create employee")
        });
    })
    
}


module.exports.updateEmployee = function(employeeData)
{
    return new Promise(function(resolve,reject)
    {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (let i in employeeData)
        {
            if (employeeData[i] == "")
            {
                employeeData[i] == null;
            }
        }

        sequelize.sync().then(function()
        {
            resolve(Employee.update(
                {
                    
                    employeeNum: employeeData.employeeNum,
                    firstName: employeeData.firstName,
                    lastName: employeeData.lastName,
                    email: employeeData.email,
                    SSN: employeeData.SSN,
                    addressStreet: employeeData.addressStreet,
                    addressCity: employeeData.addressCity,
                    addressState: employeeData.addressState,
                    addressPostal: employeeData.addressPostal,
                    maritalStatus: employeeData.maritalStatus,
                    isManager: employeeData.isManager,
                    employeeManagerNum: employeeData.employeeManagerNum,
                    status: employeeData.status,
                    department: employeeData.department,
                    hireDate: employeeData.hireDate
                },
                {
                    where:
                    {
                        employeeNum: employeeData.employeeNum
                    }
                }


            ))
        }).catch(function(err){
            reject("unable to update employee");
        })
    });
}