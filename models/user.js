var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;

var UserSchema = Schema({
    username: String,
    password: String
});

//get access to other methods
UserSchema.plugin(passportLocalMongoose);

//export schema to the application with USER
module.exports = mongoose.model("User", UserSchema);