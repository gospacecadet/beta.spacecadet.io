Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route('/', {
  name: 'homepage',
  layoutTemplate: 'layout',
  waitOn: function() {
    return [
      Meteor.subscribe('adminSettings'),
      Meteor.subscribe("paymentProcessors")
    ];
  },
  data: function() {
    return {
      adminSettings: AdminSettings.find({}),
      paymentProcessors: PaymentProcessors.find({})
    };
  }
});
