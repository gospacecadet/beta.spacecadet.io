LandingPads = new Mongo.Collection("landingPads");

LandingPads.attachSchema(new SimpleSchema({
  stationId: {
    type: String
  },
  name: {
    type: String,
    label: "Name",
    max: 50
  },
  description: {
    type: String,
    label: "Description",
    optional: true,
    max: 1000
  },
  isActive: {
    type: Boolean,
    label: "Landing Pad active?"
  },
  isDeleted: {
    type: Boolean,
    autoValue: function() {
      return false;
    }
  }
}));
