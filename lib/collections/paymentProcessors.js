PaymentProcessors = new Mongo.Collection("paymentProcessors");

PaymentProcessors.allow({
  insert: function(){
    return false;
  },
  update: function(){
    return false;
  },
  remove: function(){
    return false;
  }
});
