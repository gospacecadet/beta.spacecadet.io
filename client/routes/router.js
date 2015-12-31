FlowRouter.route('/', {
  name: "homepage",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "homepage"});
  }
});

FlowRouter.route('/reserve-docking', {
  name: "reserveDocking",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "reserveDocking"});
  }
});

FlowRouter.route('/dockings/:dockingId', {
  name: "docking",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "docking"});
  }
});

FlowRouter.route('/admin/payment', {
  name: "payment",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "payment"});
  }
});
