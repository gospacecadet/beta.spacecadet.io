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
        hook.done()
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
