Template.creditCards.onCreated(function() {
  Meteor.subscribe("mart/cards");
  Session.set("addingCreditCard", false);

  var hooksObject = {
    // Called when any submit operation succeeds
    // insertDoc: The form input values in a document, suitable for use with insert(). This object has been cleaned and validated, but auto values and default values have not been added to it.
    // updateDoc: The form input values in a modifier, suitable for use with update(). This object has not been validated.
    // currentDoc: The object that's currently bound to the form through the doc attribute
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      var that = this
      Mart.Card.createCard("Stripe", insertDoc, {}, function(err, cardId) {
        if (err) {
          that.done(new Error("Could not create new card"));
        } else {
          Session.set("addingCreditCard", false);
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
  },
  addingCreditCard: function() {
    return Session.get('addingCreditCard')
  }
});

Template.creditCards.events({
  "click #add-credit-card": function(event, template) {
    event.preventDefault();
    Session.set("addingCreditCard", true);
  },
  "click #cancel-add-credit-card": function(event, template) {
    event.preventDefault();
    Session.set("addingCreditCard", false);
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

Template.creditCardRadio.events({
  "click .creditCardRadio": function(event, template) {
    $('#updateCartFormCardId').val(template.data._id )
  }
});

var makeList = function(start, end) {
  var list = []
  for (var i = start; i <= end; i++) { list.push(i); }

  return list
}
