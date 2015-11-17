Carts = new Mongo.Collection("carts");

Carts.attachSchema(new SimpleSchema({
  ownerId: {
    type: String
  },
  isCurrent: {
    type: Boolean,
    label: "Landing Pad active?"
  }
}));
