Template.managePropertyPreview.onCreated(function() {
  var template = this
  var storefrontId = Template.currentData()._id

  if(storefrontId) {
    template.subscribe("mart/images/storefront", Template.currentData()._id);
    template.subscribe('mart/products', Template.currentData()._id)
  }
})

Template.manageSpacePreview.onCreated(function() {
  this.subscribe("mart/images/product", Template.currentData()._id);
})
