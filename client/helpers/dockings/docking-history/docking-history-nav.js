Template.dockingHistoryNav.helpers({
  dockingHistoryActive: function(type) {

    Tracker.autorun(function() {
      var klass
      var path = FlowRouter.current().path

      if(path === "/docking-history-accepted") {
        klass = (type === "accepted") ? "nav-link active" : "nav-link"
      } else if(path === "/docking-history-pending") {
        klass = (type === "pending") ? "nav-link active" : "nav-link"
      } else if(path === "/docking-history-rejected") {
        klass = (type === "rejected") ? "nav-link active" : "nav-link"
      }

      Session.set('docking-history-klass', klass)
    });

    return Session.get('docking-history-klass')
  }
});
