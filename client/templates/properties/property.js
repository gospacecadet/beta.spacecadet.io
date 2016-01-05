Template.property.onCreated(function() {
  var self = this
  self.autorun(function() {
    var propertyId = FlowRouter.getParam('propertyId')
    Meteor.subscribe("mart/storefront", propertyId);
  });

  self.autorun(function() {
    var propertyId = FlowRouter.getParam('propertyId')
  });
})

Template.property.helpers({
  property: function() {
    var propertyId = FlowRouter.getParam('propertyId')
    return Mart.Storefronts.findOne(propertyId)
  },
  spaces: function() {
    return Mart.Products.find({storefrontId: this._id})
  },
  canEdit: function() {
    // return true
    return Roles.userIsInRole(Meteor.userId(), [
      Mart.ROLES.GLOBAL.MERCHANT,
      Mart.ROLES.GLOBAL.ADMIN,
      Mart.ROLES.GLOBAL.REP
    ], Mart.ROLES.GROUPS.GLOBAL)
  },
  currentImageUrl: function() {
    let img = Mart.Images.findOne({objectId: this._id, objectCollection: "Storefronts"})

    if(img)
      return img.optimizedUrl
  }
});
