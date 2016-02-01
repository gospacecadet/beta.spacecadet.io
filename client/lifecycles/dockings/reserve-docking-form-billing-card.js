var hooksObject = {
  onSubmit: function(insertDoc, updateDoc, currentDoc) {
    var hook = this

    Mart.Card.createCard("Stripe", insertDoc, function(error, cId) {
      if(error) {
        sAlert.error(error)
      }

      hook.done()
    })

    return false
  },
};
AutoForm.addHooks(['create-card-form'], hooksObject);
