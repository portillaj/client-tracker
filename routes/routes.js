 /* global $ */
var express = require("express");
var router = express.Router();
var db = require("../models/schema");
var moment = require("moment");
var User = require("../models/user");

//GET "/clients" - client list
router.get("/clients", function(req, res){
    
    //find all clients in the database
    db.find({}, function(err, clients){
        //variables for total owed and monthly income section
        var totalOwed = 0;
        var monthlyIncome = 0;
        var getBalance, getMonthly;
        
        //foreach loop that goes through the client list and calculates the total amount owed and monthly income
        //return the balance for each section and stored into getBalance and getMonthly
        clients.forEach(function(myClient){
           totalOwed = totalOwed + (myClient.total_fee - myClient.down_payment);
           monthlyIncome = monthlyIncome + myClient.down_payment;
           getBalance = format1(totalOwed, "$");
           getMonthly = format1(monthlyIncome, "$");
        });
        
         //get currentDate with moment js
         var currentDate = moment().format('MMMM Do YYYY');
         
       if(err){
           res.redirect("/clients");
       } else {
            res.render("index", {clients: clients, total: getBalance, monthTotal: getMonthly, currentDate: currentDate});  //render the index.ejs page with the passed in objects
       }
    }).sort();

});

//POST "/clients" - add data from the form page
router.post("/clients", function(req, res){
    db.create(req.body.client, function(err, newClient){
       if(err){
           res.redirect("/add-client");
       } else {
           res.redirect("/clients");
       }
    });
});

//GET "/addclient" - insert data for new client in form
router.get("/add-client", function(req,res){
    res.render("newClient");
});


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
});

//PUT "/clients/:id" - update client information
router.put("/clients/:id", function(req, res){
    db.findByIdAndUpdate(req.params.id, req.body.client, function(err, updatedClient){
        console.log(updatedClient);
        if(err){
            res.redirect("/clients/edit");
        }else {
            res.redirect("/clients/");
        }
    });
});

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
});

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
});

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
});

//DELETE "/clients/:id" - delete client
router.delete("/clients/:id", function(req, res){
    db.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/clients");
      } else {
            res.redirect("/clients");
      }
    });
});


//====================== LOGIN/SIGN IN ROUTES =========================
//GET "/" - landing page/LOGIN
router.get("/", function(req, res) {
   res.render("login"); 
});









//function that converts number into currency format
function format1(n, currency) {
    return currency + "" + n.toFixed(2).replace(/./g, function(c, i, a) {
        return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });
}
 
//exports all the routes to app.js
module.exports = router;