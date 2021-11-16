const fs = require("fs");
var employees_array = [];
var departments_array = [];

module.exports.initialize = function()
{
    return new Promise(function(resolve,reject){

        try
        {
            fs.readFile("./data/employees.json",function(err,data)
            {
                if(err)
                {
                    reject("unable to read file");
                }
                else
                {
                    employees_array = JSON.parse(data);
                }
            })

            fs.readFile("./data/departments.json",function(err,data){
                if(err)
                {
                    reject("unable to read file");
                }
                else
                {
                    departments_array = JSON.parse(data);
                    resolve("Successfully Parsed JSON files")
                }
            })

        }

        catch{
            reject("unable to read file");
        }
    })
}


module.exports.getAllEmployees = function()
{
    return new Promise(function(resolve,reject){
        var len = employees_array.length;
        if(len==0)
        {
            reject("no results returned");
        }
        else{
            resolve(employees_array);
        }
    })
}


module.exports.getDepartments = function()
{
    return new Promise(function(resolve,reject){
        var len = departments_array.length;
        if(len==0)
        {
            reject("no results returned");
        }
        else{
            resolve(departments_array);
        }
    })
}

module.exports.getManagers = function()
{
    return new Promise(function(resolve,reject){
        var len = employees_array.length;
        var manager_array = [];
        var i = 0;
        for(i;i<len;i++)
        {
            if(employees_array[i].isManager == true)
            {
                manager_array.push(employees_array[i]);
            }
        }
        if(manager_array.length == 0)
        {
            reject("no results returned");
        }
        else
        {
            resolve(manager_array);
        }
    })
}

module.exports.addEmployee = function(employeeData)
{
    return new Promise(function(resolve,reject){
        if(employeeData.isManager == false) //unchecked
        {
            employeeData.isManager = false;
        }
        else
        {
            employeeData.isManager = true;
        }
        var len = employees_array.length + 1;
        employeeData.employeeNum = len;
        employees_array.push(employeeData);
        resolve();
    })
}

module.exports.getEmployeesByStatus = function(status)
{
    return new Promise(function(resolve,reject){
        var sendEmployees = [];
        for(let i = 0;i < employees_array.length; i++)
        {
            if(employees_array[i].status == status)
            {
                sendEmployees.push(employees_array[i]);
            }
        }
        if(sendEmployees.length == 0)
        {
            reject("no results returned");
        }
        else
        {
            resolve(sendEmployees);
        }
    })
}

module.exports.getEmployeesByDepartment= function(department)
{
    return new Promise(function(resolve,reject)
    {
        var sendEmployees2 = [];
        for(let i = 0; i < employees_array.length; i++)
        {
            if(employees_array[i].department == department)
            {
                sendEmployees2.push(employees_array[i]);
            }
        }
        if(sendEmployees2.length == 0)
        {
            reject("no results returned");
        }
        else
        {
            resolve(sendEmployees2);
        }
    })
}

module.exports.getEmployeesByManager = function(manager)
{
    return new Promise(function(resolve,reject){
        var sendEmployees3 = [];
        for(let i = 0; i < employees_array.length; i++)
        {
            if(employees_array[i].employeeManagerNum == manager)
            {
                sendEmployees3.push(employees_array[i]);
            }
        }
        if(sendEmployees3.length == 0)
        {
            reject("no results returned");
        }
        else
        {
            resolve(sendEmployees3);
        }
    })
}

module.exports.getEmployeeByNum = function(empNumber)
{
    return new Promise(function(resolve,reject){
        var sendEmployees4;
        for(let i = 0; i < employees_array.length; i++)
        {
            if(employees_array[i].employeeNum == empNumber)
            {
                sendEmployees4 = employees_array[i];
                break;
            }
        }
        if(sendEmployees4.length == 0)
        {
            reject("no results returned");
        }
        else
        {
            resolve(sendEmployees4);
        }
    })

}

module.exports.updateEmployee = function(employeeData)
{
    return new Promise(function(resolve,reject)
    {
        check = true;
        for(let i = 0; i < employees_array.length; i ++)
        {
            if(employeeData.empNumber == employees_array[i].empNumber)
            {
                employees_array[i] = employeeData;
                break;
            }
        }
        if(check)
        {
            resolve();
        }
        else
        {
            reject("Could not find the Employee");
        }
    })
}