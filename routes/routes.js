var express = require("express");
var router = express.Router();
var db = require("../models/schema");
var moment = require("moment");

//GET "/" - landing page
router.get("/", function(req, res) {
   res.render("landing"); 
});

//GET "/clients" - client list
router.get("/clients", function(req, res){
    //get currentDate with moment js
   
    
    db.find({}, function(err, clients){
         var currentDate = moment().format('MMMM Do YYYY');
        console.log(clients);
       if(err){
           res.redirect("/clients");
       } else {
            res.render("index", {clients: clients, currentDate: currentDate}); 
       }
    });

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

//exports all the routes to app.js
module.exports = router;