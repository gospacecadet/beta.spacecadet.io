Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [
      Meteor.subscribe('cart'),
    ];
  },
});

Router.route('/station/:_id', {
  name: 'station',
  layoutTemplate: 'layout',
  waitOn: function() {
    return [
      Meteor.subscribe('stations'),
      Meteor.subscribe('landingPads', this.params._id)
    ];
  },
  data: function() {
    return {
      station: Stations.findOne(this.params._id),
      landingPads: LandingPads.find({})
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
