Template.creditCardRadio.helpers({
  label: function() {
    return this.brand + " **" + this.last4 +
      " (" + this.expMonth + "/" + this.expYear + ")"
  }
});
