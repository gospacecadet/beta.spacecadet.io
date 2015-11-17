LineItems = new Mongo.Collection("lineItems");

LineItems.attachSchema(new SimpleSchema({
  cartId: {
    type: String
  },
  landingPadId: {
    type: String
  },
  quantity: {
    type: Number
  }
}));
