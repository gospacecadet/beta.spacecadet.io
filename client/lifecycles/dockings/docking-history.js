_.each(["Pending", "Rejected", "Accepted"], function(state) {
  Template["dockingHistory" + state].onCreated(function() {
    if(!Meteor.userId())
      forbid()

    var template = this
    this.autorun(function() {
      var states = Mart.Cart._STATES()
      template.subscribe("mart/carts", states);
    });
  })


})
