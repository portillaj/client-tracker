//require express, mongoose, body-parser
var express         = require("express"),
    app                 = express(),
    engine            = require('ejs-locals'),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    User            = require("./models/user");

const port = process.env.PORT || 3000;

app.engine('ejs', engine);

//get the css and images files from public directory
app.use(express.static(__dirname + "/public"));

//setting up EJS templating
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//store routes.js file to routes variable
var routes = require("./routes/routes.js");

//setting up all routes here
app.use("/register", routes);

//server listening
app.listen(port, function(){
    console.log("client App server has started");
});
