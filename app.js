//require express, mongoose, body-parser
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    braintree       = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "f2wz6j8grwtmwwpj",
  publicKey: "6q7j4pvbp92s6w36",
  privateKey: "a3b380c03f83622faaee9f96bfacaf0f"
});

const port = process.env.PORT || 3000;

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
app.listen(port, function(){
    console.log("client App server has started");
});
