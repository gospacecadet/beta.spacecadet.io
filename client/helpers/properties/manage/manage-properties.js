Template.manageProperties.helpers({
  properties: function() {
    return Mart.Storefronts.find({userId: Meteor.userId()})
  },
  hasProperties: function() {
    return Mart.Storefronts.find({userId: Meteor.userId()}).count() > 0
  }
});
