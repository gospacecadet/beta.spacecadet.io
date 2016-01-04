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
  },
  spaceData: function() {
    var propertyId = FlowRouter.getParam('propertyId')
    var p = Mart.Storefronts.findOne(propertyId)

    if(p) {
      var a = [p.address, p.address2, p.city, p.state, p.zip]
      a = _.filter(a, function(e) { return e && e.length > 0})
      var a = a.join(", ")

      return _.extend(this, {propertyName: p.name, address: a})
    }

    return this
  }
});
