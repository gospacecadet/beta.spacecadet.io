Template.manageProperties.helpers({
  properties: function() {
    return Mart.Storefronts.find({userId: Meteor.userId()})
  }
});
