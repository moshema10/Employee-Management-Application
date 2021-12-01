/*********************************************************************************
* BTI325 – Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Shehtab Masud Student ID: 119038206 Date: 11/30/2021
*
* Online (Heroku) Link: https://pure-mesa-97836.herokuapp.com/
********************************************************************************/



var data_service = require("./data-service") //my_module
var fs = require("fs");
var express = require("express");
var multer = require("multer");
var bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;

//Handlebars
app.engine('hbs',engine({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers:
    {
        navLink: function(url, options){
            return '<li' + 
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') 
            + 
            '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) 
        {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) 
            {
                return options.inverse(this);
            } 
            else 
            {
                return options.fn(this);
            }
        } 

    },
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine','.hbs');

var onHTTPStart = function()
{
    console.log("Express http server listening on port: " + HTTP_PORT);
}


var storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req,file,cb)
    {
        cb(null,Date.now() + path.extname(file.originalname));
    }
})

var upload = multer({storage:storage});

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
})

/*----------------------------------------------------POST-------------------------------------------------------*/

app.post("/images/add",upload.single("imageFile"),function(req,res)
{
    //res.send("/images");
    res.redirect("/images");
})


app.post("/employees/add",function(req,res)
{
    data_service.addEmployee(req.body).then(function(data){
        console.log(req.body);
        res.redirect("/employees");
    }).catch(function(err){
        console.log(err);
    });
})

app.post("/departments/add",function(req,res){
    data_service.addDepartment(req.body).then(function(data){
        console.log(req.body);
        res.redirect("/departments");
    }).catch(function(err){
        console.log(err);
    })
})

app.post("/employee/update", (req, res) => {
    data_service.updateEmployee(req.body).then(function()
    {
        res.redirect("/employees");
    }).catch(function(err){
        res.render("employees",{message: err});
    });

})

app.post("/department/update",function(req,res){
    data_service.updateDepartment(req.body).then(function()
    {
        res.redirect("/departments");
    }).catch(function(err){
        res.render("departments",{message:err});
    })
})
/*----------------------------------------------------GET--------------------------------------------------------*/
//HOME
app.get("/",function(req,res){
    res.render("home")
})

//About
app.get("/about",function(req,res){
    //let about_path = path.join(__dirname + "/views/about.html");
    //res.sendFile(about_path);
    res.render("about");
})

app.get("/images/add",function(req,res)
{
    //let addImagepath = path.join(__dirname + "/views/addImage.html");
    //res.sendFile(addImagepath);
    res.render("addImage");
})

app.get("/images",function(req,res){
    let dirpath = "./public/images/uploaded";
    let imagesArray = [];
    fs.readdir(dirpath,function(err,data)
    {
        for(let i = 0;i < data.length; i++)
        {
            imagesArray.push(data[i]);
        }
        res.render("images",{data:imagesArray});
        //res.json({"images":imagesArray});
    })

})

app.get("/departments",function(req,res){
    

    data_service.getDepartments().then(function(data)
    {
        if(data.length > 0)
        {
            res.render("departments",{departments:data});
        }
            
        else
        {
            res.render("departments",{message: "no results"});
        }

    }).catch(function(err){
        res.render("departments",{message: "no results"});
    })
})

//               ||
// All Employees VV
//

app.get("/employees/add",function(req,res)
{
    data_service.getDepartments().then(function(data){
        res.render("addEmployee",{departments: data});
    }).catch(function(err){
        console.log(err);
        res.render("addEmployee", {departments: []});
    })
        

})

app.get("/departments/add",function(req,res){
    res.render("addDepartment");
})

app.get("/employees",function(req,res)
{
    if(req.query.status)
    {
        data_service.getEmployeesByStatus(req.query.status).then(function(data){
            if(data.length > 0)
                res.render("employees",{employees:data});
            else
                res.render("employees",{message: "no results"});
        }).catch(function(err){
            res.render("employees",{message: "no results"});
        })
    }

    else if(req.query.department)
    {
        data_service.getEmployeesByDepartment(req.query.department).then(function(data){
            if(data.length > 0)
                res.render("employees",{employees:data});
            else
                res.render("employees",{message: "no results"});
        }).catch(function(err){
            res.render("employees",{message: "no results"});
        })
    }

    else if(req.query.manager)
    {
        data_service.getEmployeesByManager(req.query.manager).then(function(data){
            if(data.length > 0)
                res.render("employees",{employees:data});
            else
                res.render("employees",{message: "no results"});
        }).catch(function(err){
            res.render("employees",{message: "no results"});
        })
    }

    else{

        data_service.getAllEmployees().then(function(data)
        {
            if(data.length > 0)
            {
                res.render("employees",{employees:data});
            }
            else
            {
                res.render("employees",{message: "no results"});
            }
        }).catch(function(err){
            res.render("employees",{message: "no results"});

        })
    }


})

app.get("/employee/:empNum", (req, res) => {

    //console.log("------------------------------------------")
    // initialize an empty object to store the values
    let viewData = {employee: null,department:null};

    data_service.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            console.log(data);
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch((err) => {
        console.log(err);
        viewData.employee = null; // set employee to null if there was an error 
    }).then(data_service.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching 
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                //console.log(viewData);
                res.render("employee", { viewData: viewData });
                  // render the "employee" view
            }
        }).catch((err)=>{
            res.status(500).send("Unable to Update Employee");
           });;
   })
app.get("/department/:departmentId",function(req,res){

    data_service.getDepartmentById(req.params.departmentId).then(function(data){
        if(data.length() > 0)
            res.render("department",{department:data});
        else
            res.status(404).send("Department Not Found");
    }).catch(function(err){
        res.status(404).send("Department Not Found");
    })

})



app.get("/managers",function(req,res){

    var managers_data = [];
    data_service.getManagers().then(function(data)
    {
        managers_data = data;
        res.header("Content-Type",'application/json');
        res.json(managers_data);
    }).catch(function(err){
        res.header("Content-Type",'application/json');
        res.json({message:err});
    })
})

app.get("/employee/delete/:empNum", (req, res)=>{
    data_service.deleteEmployeeByNum(req.params.empNum)
        .then((data)=>{
            res.redirect("/employees");
        })
        .catch((err)=>{
            res.status(500).send("Unable to Remove Employee / Employee not found")
        })
});


app.get("*",function(req,res){
    res.status(404).send("Page Not Found");
})

data_service.initialize().then(()=>{
    app.listen(HTTP_PORT,onHTTPStart());
}).catch((reject)=>{
    console.log(reject);
})
