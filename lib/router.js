Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route('/station/:_id', {
  name: 'station',
  layoutTemplate: 'layout',
  waitOn: function() {
    return [
      Meteor.subscribe('stations')
    ];
  },
  data: function() {
    return {
      station: Stations.findOne(this.params._id)
    };
  }
});

Router.route('/', {
  name: 'homepage',
  layoutTemplate: 'layout',
  waitOn: function() {
    return [
      Meteor.subscribe('adminSettings'),
      Meteor.subscribe("paymentProcessors"),
      Meteor.subscribe('stations')
    ];
  },
  data: function() {
    return {
      adminSettings: AdminSettings.find({}),
      paymentProcessors: PaymentProcessors.find({}),
      stations: Stations.find({})
    };
  }
});
