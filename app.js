//require express, mongoose, body-parser
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override");

//get the css and images files from public directory
app.use(express.static(__dirname + "/public"));
//setting up EJS templating
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


//store routes.js file to routes variable
var routes = require("./routes/routes.js");

//setting up all routes here
app.use("/", routes);

//server listening
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("client App server has started"); 
});

//function that calculates the income from payments
//function that displays the current date

