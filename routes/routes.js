var express = require("express");
var router = express.Router();
var db = require("../models/schema");
var moment = require("moment");
var User = require("../models/user");
var passport = require("passport"),
    LocalStrategy   = require("passport-local"),
    expressSession  = require("express-session"),
    cookieParser    = require("cookie-parser");

//PASSPORT CONFIGURATION
router.use(expressSession({
    secret: process.env.SESSION_SECRET || 'secret',
    saveUninitialized: false,
    resave: false
}));
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//END PASSPORT CONFIGURATION

//middleware to all routes so the nav bar can hide or show login logout and signup links
router.use(function(req, res, next){
    console.log(req.user);
    res.locals.currentUser = req.user;
    next();
});


//GET "/clients" - client list
router.get("/clients", isLoggedIn, function(req, res){
    
    //find all clients in the database
    db.find({}, function(err, clients){
        //variables for total owed and monthly income section
        var totalOwed = 0;
        var monthlyIncome = 0;
        var getBalance, getMonthly;
        var totalClients = 0;
        
        //foreach loop that goes through the client list and calculates the total amount owed and monthly income
        //return the balance for each section and stored into getBalance and getMonthly
        clients.forEach(function(myClient){
           totalOwed = totalOwed + (myClient.total_fee - myClient.down_payment);
           monthlyIncome = monthlyIncome + myClient.down_payment;
           getBalance = format1(totalOwed, "$");
           getMonthly = format1(monthlyIncome, "$");
        });
       
        //if error occurs, redirect to the same page
       if(err){
           res.redirect("/clients");
       } else {
            res.render("index", {clients: clients, total: getBalance, monthTotal: getMonthly, totalClients: totalClients});  //render the index.ejs page with the passed in objects
       }
    });

}); //end get("/clients) route


//POST "/clients" - add data from the form page
router.post("/clients", function(req, res){
    db.create(req.body.client, function(err, newClient){
       if(err){
           res.redirect("/add-client");
       } else {
           res.redirect("/clients");
       }
    });
}); //end post("/clients) route


//GET "/addclient" - insert data for new client in form
router.get("/add-client", function(req,res){
    res.render("newClient");
}); //end get("/add-client) route


//GET "/clients/:id" - get information of client
router.get("/clients/:id", function(req, res) {
    db.findById(req.params.id, function(err, foundClient){
       if(err){
           res.redirect("/clients");
       } else {
           res.render("index", {clients: foundClient});
           res.json(foundClient);
       }
   });
}); //end route


//PUT "/clients/:id" - update client information
router.put("/clients/:id", function(req, res){
    db.findByIdAndUpdate(req.params.id, req.body.client, function(err, updatedClient){
        if(err){
            res.redirect("/clients/edit");
        }else {
            res.redirect("/clients/");
        }
    });
}); //end route


//GET "/clients/:id/edit" - edit client information in form
router.get("/clients/:id/edit", function(req, res){
    db.findById(req.params.id, function(err, foundClient){
        console.log(foundClient);
        if(err){
            res.redirect("/clients");
        } else {
            res.render("edit", {client: foundClient});
        }
    });
}); //end route


//payment update route
router.put("/clients/payment/:id", function(req, res){
    db.findByIdAndUpdate(req.params.id, req.body.client, function(err, clientPayment){
        console.log(clientPayment);
        if(err){
            res.redirect("/clients/payment");
        }else {
            res.redirect("/clients/");
        }
    });
}); //end route


//GET "/clients/:id/payment" - make payment page for client
router.get("/clients/:id/payment", function(req, res){
    db.findById(req.params.id, function(err, foundClient){
        console.log(foundClient);
        if(err){
            res.redirect("/clients");
        } else {
            res.render("payment", {client: foundClient});
        }
    });
}); //end route


//DELETE "/clients/:id" - delete client
router.delete("/clients/:id", function(req, res){
    db.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/clients");
      } else {
            res.redirect("/clients");
      }
    });
}); //end route


//====================== LOGIN/SIGN IN ROUTES =========================

//GET "/" - landing page/LOGIN
router.get("/login", function(req, res) {
   res.render("login"); 
}); //end route


//route where the login credentials is handled
router.post("/login", passport.authenticate('local', {
    successRedirect: '/clients',
    failureRedirect: '/login'
})); //end route

         
//route where the user can register their profile
router.get("/register", function(req, res){
    res.render('register');
}); //end route


//route where the register process is handled
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email: req.body.email
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/login");
        });
    });
}); //end route


//route where the user will log out when link is clicked
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
}); //end route


//=============================FUNCTIONS SECTION ==============================


//function to check if user is logged in (middleware)
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}//end function

//function that converts number into currency format
function format1(n, currency) {
    return currency + "" + n.toFixed(2).replace(/./g, function(c, i, a) {
        return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });
} //end function

 
//exports all the routes to app.js
module.exports = router;