 /* global $ */
  /* global moment */
    /* global location */
var totalAmountOwed = 0;  
$(document).ready(function(){


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
        
      //get the remaining balance from client
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
        $(".edit-buttons").html(editButton);
        
        //when edit button is clicked, the url will take them to the edit page to make changes
        $(".edit-client-button").on("click", function(){
           window.location.href='/clients/' + response._id + '/edit'; 
        });//end edit click button function
        
    }); //end promise function
    
});//end view client click button

$('.option a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  var target = $(this).attr('href');

//   $('.tab-content > div').not(target).hide();
  
//   $(target).fadeIn(600);
  
});

});//end document.ready


//function that converts number into currency format
function format1(n, currency) {
    return currency + "" + n.toFixed(2).replace(/./g, function(c, i, a) {
        return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });
}

//function that calculates the initial balance of client with down payment if there is one
function clientBalance(totalFee, down) {
  return totalFee - down;
}

//function that calculates balance after a payment is made by client
function payment(totalFee, clientPayment){
    return totalFee - clientPayment;
}