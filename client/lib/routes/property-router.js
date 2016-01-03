FlowRouter.route('/new-property', {
  name: "newProperty",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "newProperty"});
  }
});

FlowRouter.route('/:propertyId', {
  name: "property",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "property"});
  }
});

FlowRouter.route('/:propertyId/edit', {
  name: "editProperty",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "editProperty"});
  }
});

FlowRouter.route('/manage', {
  name: "manageProperties",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "manageProperties"});
  }
});
