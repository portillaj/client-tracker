//require express, mongoose, body-parser
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    expressSession  = require("express-session"),
    cookieParser    = require("cookie-parser"),
    methodOverride  = require("method-override"),
    User            = require("./models/user");

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

//PASSPORT CONFIGURATION
app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'secret',
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//END PASSPORT CONFIGURATION

//middleware to all routes so the nav bar can hide or show login logout and signup links
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//server listening
app.listen(port, function(){
    console.log("client App server has started"); 
});