Template.spaceCard.onCreated(function() {
  var template = this
  var spaceId =  Template.currentData()._id
  
  this.autorun(function() {
    template.subscribe("mart/images/product", spaceId);
    template.subscribe("mart/prices", spaceId);
  });
})
