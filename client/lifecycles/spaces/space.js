Template.space.onCreated(function() {
  var template = this
  this.autorun(function() {
    var spaceId = FlowRouter.getParam('spaceId')
    template.subscribe("mart/product", spaceId);
  });
})
