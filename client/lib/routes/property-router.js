FlowRouter.route('/new-property', {
  name: "newProperty",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "newProperty"});
  }
});

FlowRouter.route('/properties', {
  name: "manageProperties",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "manageProperties"});
  }
});

FlowRouter.route('/:propertyId/edit', {
  name: "editProperty",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "editProperty"});
  }
});

FlowRouter.route('/:propertyId', {
  name: "property",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "property"});
  }
});
