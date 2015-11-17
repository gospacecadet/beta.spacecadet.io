Template.cart.helpers({
  landingPadName: function() {
    var landingPad = LandingPads.findOne(this.landingPadId);
    return landingPad.name;
  }
});
