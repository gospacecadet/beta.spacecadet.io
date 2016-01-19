Template.managePropertyPreview.onCreated(function() {
  Meteor.subscribe("mart/images/storefront", Template.currentData()._id);
})

Template.manageSpacePreview.onCreated(function() {
  Meteor.subscribe("mart/images/product", Template.currentData()._id);
})
