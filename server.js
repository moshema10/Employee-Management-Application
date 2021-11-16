/*********************************************************************************
* BTI325 – Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Shehtab Masud Student ID: 119038206 Date: 11/01/2021
*
* Online (Heroku) Link: https://sheltered-badlands-59607.herokuapp.com/
********************************************************************************/



var data_service = require("./data-service") //my_module
var fs = require("fs");
var express = require("express");
var multer = require("multer");
var bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
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

    }
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
    data_service.addEmployee(req.body).then(function(){
        res.redirect("/employees");
    });
})

app.post("/employee/update", (req, res) => {
    data_service.updateEmployee(req.body).then(function()
    {
        res.redirect("/employees");
    }).catch(function(err){
        res.render("employees",{message: err});
    });

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
    
    var departments_data = [];
    data_service.getDepartments().then(function(data)
    {
        departments_data = data;
        res.render("departments",{departments:departments_data});
    }).catch(function(err){
        res.render("departments",{message: "no results"});
    })
})

app.get("/employees/add",function(req,res)
{
    //let addemployeepath = path.join(__dirname + "/views/addEmployee.html");
    //res.sendFile(addemployeepath);
    res.render("addEmployee");
})

app.get("/employees",function(req,res)
{
    if(req.query.status)
    {
        data_service.getEmployeesByStatus(req.query.status).then(function(data){
            res.render("employees",{employees:data});
        }).catch(function(err){
            res.render("employees",{message: "no results"});
        })
    }

    else if(req.query.department)
    {
        data_service.getEmployeesByDepartment(req.query.department).then(function(data){
            res.render("employees",{employees:data});
        }).catch(function(err){
            res.render("employees",{message: "no results"});
        })
    }

    else if(req.query.manager)
    {
        data_service.getEmployeesByManager(req.query.manager).then(function(data){
            res.render("employees",{employees:data});
        }).catch(function(err){
            res.render("employees",{message: "no results"});
        })
    }

    else{
        var employee_data = [];
        data_service.getAllEmployees().then(function(data)
        {
            employee_data = data;
            res.render("employees",{employees:employee_data});
            // res.header("Content-Type",'application/json');
            // res.json(employee_data);
        }).catch(function(err){
            res.render("employees",{message: "no results"});
            // res.header("Content-Type",'application/json');
            // res.json({message:err});
        })
    }


})

app.get("/employee/:empnum",function(req,res)
{
    data_service.getEmployeeByNum(req.params.empnum).then(function(data){
        res.render("employee",{employee:data});
    }).catch(function(err){
        res.render("employee",{message: "no results"});
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


app.get("*",function(req,res){
    res.status(404).send("Page Not Found");
})

data_service.initialize().then(()=>{
    app.listen(HTTP_PORT,onHTTPStart());
}).catch((reject)=>{
    console.log(reject);
})
