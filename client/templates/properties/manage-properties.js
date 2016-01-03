Template.manageProperties.onCreated(function() {
  Meteor.subscribe("mart/storefronts");
})

Template.manageProperties.helpers({
  properties: function() {
    if(Mart.isAdmin()) {
      return Mart.Storefronts.find()
    } else if(Mart.isRep()) {
      return Mart.Storefronts.find({repId: Meteor.userId()})
    } else if(Mart.isMerchant()) {
      return Mart.Storefronts.find({userId: Meteor.userId()})
    }
  }
});
