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

FlowRouter.route('/docking/:dockingId', {
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

FlowRouter.route('/new-station', {
  name: "newStation",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "newStation"});
  }
});

FlowRouter.route('/stations/:stationId', {
  name: "station",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "station"});
  }
});
