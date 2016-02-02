Template.dockingHistoryNav.helpers({
  dockingHistoryActive: function(type) {
    var klass
    Tracker.autorun(function() {
      var path = FlowRouter.current().path

      if(path === "/docking-history-accepted") {
        klass = (type === "accepted") ? "nav-link active" : "nav-link"
      } else if(path === "/docking-history-pending") {
        klass = (type === "pending") ? "nav-link active" : "nav-link"
      } else if(path === "/docking-history-rejected") {
        klass = (type === "rejected") ? "nav-link active" : "nav-link"
      } else if(path === "/subscriptions") {
        klass = (type === "subscriptions") ? "nav-link active" : "nav-link"
      }
    });

    return klass
  }
});
