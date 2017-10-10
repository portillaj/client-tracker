var mongoose = require("mongoose");

//APP CONFIG
mongoose.Promise = global.Promise;
var db = 'mongodb://portillaj:port6911@ds115045.mlab.com:15045/clients' || "mongodb://localhost/client_tracker";
mongoose.connect(db, {useMongoClient: true}, function(error) {
  if(error) {
    console.log(error);
  }else {
    console.log("Mongoose connection is successful");
  }
});

  //MONGOOSE/MODEL CONFIG
var clientSchema = new mongoose.Schema({
   fname: {
        type: String,
        required: true
   },
   lname: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
   },
    total_fee: {
        type: Number,
        trim: true,
        default: 0
    },
    date_paid: {
        type: String,
        trim: true,
        default: 'Paid In Full'
    },
    down_payment: {
        type: Number,
        trim: true,
        default: 0
    },
    case_number: {
        type: String,
        trim: true,
        required: true
    },
    phone_number: {
        type: String,
        trim: true
    },
    pay_plan: {
        type: Number,
        trim: true,
        default: 0
    },
    pay_freq: {
        type: String,
        default: "Paid In Full"
    },
    balance: {
        type: Number,
        trim: true
    },
    created: {
        type: Date, default: Date.now
    }
});

var Client = mongoose.model("Client", clientSchema);

module.exports = Client;
