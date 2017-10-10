 /* global $ */
  /* global moment */
    /* global location */

  //variables for total owed and monthly income section
        var totalOwed = 0;
        var monthlyIncome = 0;
        var getBalance, monthTotal;
//when the user clicks on the view button, the client information will show up on the section
$(".view-client-button").on("click", function(event){
    //prevent default behavior of button
    event.preventDefault();

    //get the right client information when button clicked
    var viewClient = $(this).data("id");

    //ajax call to route to get information from the server and display content on screen
      $.ajax({
      url: "/clients/" + viewClient,
      method: "GET"
    }).done(function(response) {

      //get the remaining balance from client using clientBalance function
       response.balance = clientBalance(response.total_fee, response.down_payment);

       //when user clicks on view client button, HTML is displayed
       var details = '<div class="left-details">\
                        <h3>' + response.fname + '</h3><input class="view-data" type="text"/>\
                        <h5>First Name</h5>\
                        <h3>' + response.phone_number + '</h3>\
                        <input class="view-data" type="text"/>\
                        <h5>Phone Number</h5>\
                        <h3>' + format1(response.pay_plan, "$") + '</h3>\
                        <input class="view-data" type="text"/>\
                        <h5>Payment Plan Type</h5>\
                        <h3>' + response.date_paid + '</h3>\
                        <input class="view-data" type="text"/>\
                        <h5>First Payment Made</h5>\
                        <h3>' + format1(response.balance, "$") + '</h3>\
                         <input class="view-data" type="text"/>\
                      <h5>Client Balance</h5>\
                    </div>\
                    <div class="right-details">\
                        <h3>' + response.lname + '</h3>\
                        <input class="view-data" type="text"/>\
                        <h5>Last Name</h5>\
                        <h3>' + format1(response.total_fee, "$") + '</h3>\
                        <input class="view-data" type="text"/>\
                        <h5>Total Fee</h5>\
                       <h3>' + format1(response.down_payment, "$") + '</h3>\
                       <input class="view-data" type="text"/>\
                       <h5>Down Payment</h5>\
                        <h3>' + response.pay_freq + '</h3>\
                         <input class="view-data" type="text"/>\
                      <h5>Pay Frequency</h5>\
                       <h3>' + response.case_number + '</h3>\
                         <input class="view-data" type="text"/>\
                      <h5>Court Case Number</h5>\
                    </div>';

        //display the content on screen
        $("#display-data").html(details);

        //adding edit button when the user clicks on view and they want to edit client information
        var editButton = $("<button>").addClass("btn btn-lg btn-warning edit-client-button").text("Edit Client");
        var paymentButton = $("<button>").addClass("btn btn-lg btn-success payment-client-button").text("Make Payment");
        $(".edit-buttons").html(editButton);
        $(".make-payment").html(paymentButton);

        //when edit button is clicked, the url will take them to the edit page to make changes
        $(".edit-client-button").on("click", function(){
           window.location.href='/clients/' + response._id + '/edit';
        });//end edit click button function

        //when the make payment button is clicked, the page will go to the payment route to edit payment
        $(".payment-client-button").on("click", function(){
           window.location.href='/clients/' + response._id + '/payment';
        });//end edit click button function

    }); //end promise function

});//end view client click button


//deleteClient function is run when the user clicks on delete button
$("#delete-client").on("click", deleteClient);


//using moment js to get current date and display it on screen
var now = moment();
var currentDate = now.format('MMMM Do YYYY');

//display date on screen :)
$('#date-display').html(currentDate);


//list js library - sort clients by first or last name
//also search bar is used to find clients easily
var options = {
    valueNames: [ 'lname', 'fname']
};

//list js library - using ID client-names to sort
var clientList = new List('client-names', options);


var form = document.querySelector('#cardForm');
var authorization = 'sandbox_fvkg8dsh_f2wz6j8grwtmwwpj';

braintree.client.create({
  authorization: authorization
}, function(err, clientInstance) {
  if (err) {
    console.error(err);
    return;
  }
  createHostedFields(clientInstance);
});

function createHostedFields(clientInstance) {
  braintree.hostedFields.create({
    client: clientInstance,
    styles: {
      'input': {
        'font-size': '16px',
        'font-family': 'courier, monospace',
        'font-weight': 'lighter',
        'color': '#ccc'
      },
      ':focus': {
        'color': 'black'
      },
      '.valid': {
        'color': '#8bdda8'
      }
    },
    fields: {
      number: {
        selector: '#card-number',
        placeholder: '4111 1111 1111 1111'
      },
      cvv: {
        selector: '#cvv',
        placeholder: '123'
      },
      expirationDate: {
        selector: '#expiration-date',
        placeholder: 'MM/YYYY'
      },
      postalCode: {
        selector: '#postal-code',
        placeholder: '11111'
      }
    }
  }, function (err, hostedFieldsInstance) {
    var teardown = function (event) {
      event.preventDefault();
      alert('Submit your nonce to your server here!');
      hostedFieldsInstance.teardown(function () {
        createHostedFields(clientInstance);
        form.removeEventListener('submit', teardown, false);
      });
    };

    form.addEventListener('submit', teardown, false);
  });
}

//========================== FUNCTIONS SECTION =============================

//function that converts number into currency format
function format1(n, currency) {
    return currency + "" + n.toFixed(2).replace(/./g, function(c, i, a) {
        return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });
}//end format1 function

//function that calculates the initial balance of client with down payment if there is one
function clientBalance(totalFee, down) {
  return totalFee - down;
}//end clientBalance function

//function that deletes the client with confirmation
function deleteClient() {
    var confirmation = confirm('Are you sure you want to delete client'); //confirmation prompt
     var deleteClient = $(this).data("id"); //delete client variable that selects that client only
     if(confirmation){ //if user hit yes, run the following code, if not return false
        $.ajax({
            type: 'DELETE',
            url: '/clients/' + deleteClient,
        }).done(function(response){
             window.location.replace('/clients');
        });
    } else {
        return false;
    }
}//end deleteClient function
