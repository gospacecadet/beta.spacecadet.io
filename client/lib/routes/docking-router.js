FlowRouter.route('/dock', {
  name: "dock",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "reserveDocking"});
  }
});
