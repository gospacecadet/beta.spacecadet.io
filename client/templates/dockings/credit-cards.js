Template.creditCards.onCreated(function() {
  Meteor.subscribe("mart/cards");

  var hooksObject = {
    // Called when any submit operation succeeds
    // insertDoc: The form input values in a document, suitable for use with insert(). This object has been cleaned and validated, but auto values and default values have not been added to it.
    // updateDoc: The form input values in a modifier, suitable for use with update(). This object has not been validated.
    // currentDoc: The object that's currently bound to the form through the doc attribute
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      var that = this
      Mart.Card.createCard("Stripe", insertDoc, {}, function(err, cardId) {
        if (err) {
          console.log("ERROR: " + err.message)
          that.done(new Error("Could not create new card"));
        } else {
          that.done();
        }
      });
      return false;
    },
  };
  AutoForm.addHooks(['createCardForm'], hooksObject);
})

Template.creditCards.helpers({
  creditCards: function() {
    return Mart.Cards.find()
  },
  hasCreditCards: function(creditCards) {
    return Mart.Cards.find().count() > 0
  },
  expYearOptions: function() {
    var start = new Date().getFullYear()
    var end = start + 20

    return _.map(makeList(start, end), function(year) { return {lable: year, value: year}})
  },
  expMonthOptions: function() {
    return _.map(makeList(0, 12), function(month) { return {lable: month, value: month}})
  }
});

Template.creditCardRadio.helpers({
  id: function() {
    return this.gatewayToken
  },
  label: function() {
    return this.nameOnCard + ", " +
    this.brand + ", " +
    " **" + this.last4 + ", " +
    this.expMonth + "/" + this.expYear
  },
});

var makeList = function(start, end) {
  var list = []
  for (var i = start; i <= end; i++) { list.push(i); }

  return list
}
