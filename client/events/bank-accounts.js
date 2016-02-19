Template.savedBankAccount.events({
  "click .activate-bank-account-button": function(event, template){
     Meteor.call('mart/stripe/activate-bank-account', template.data._id, function(error, result) {
       if(error) {
        //  console.log(error);
         sAlert.error(error.message)
       } else {
         sAlert.success("Bank account successfully activated")
       }
     })
  }
});
