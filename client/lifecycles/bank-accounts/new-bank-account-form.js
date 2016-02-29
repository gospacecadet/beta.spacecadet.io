var hooksObject = {
  onSubmit: function(insertDoc, updateDoc, currentDoc) {
    var hook = this
    Mart.createBankAccount('Stripe', insertDoc, function(error, bId) {
      if(error) {
        // console.log(error);
        hook.done(error)
      } else {
        Session.set('adding-bank-account', false)
        sAlert.success("Account successfuly linked")

        Meteor.call("mart/stripe/verify", function(error, result) {
         if(error) {
           // sAlert.error("Could not activate your merchant account on Stripe. Please contact support.")
         }
         if(result) {
            sAlert.success("Account validated on Stripe. If you have a bank account linked to your account, we can now start paying out to your account.")
         }
         hook.done()
       });

      }
    })

    return false;
  },
  onError: function(operation, error) {
    console.log(error);
    if(error && error.message) {
      sAlert.error(error.message)
    }
  }
};
AutoForm.addHooks(['newBankAccountFormId'], hooksObject);
