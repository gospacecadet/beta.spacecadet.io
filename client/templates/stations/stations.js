Template.stations.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('mart/merchants')
  })
})

Template.stations.helpers({
  stations: function() {
    return Mart.Merchants.find({})
  }
});
