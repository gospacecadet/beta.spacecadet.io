Stations = new Mongo.Collection("stations");

Stations.attachSchema(new SimpleSchema({
  ownerId: {
    type: String,
    autoValue: function() {
      return this.userId;
    }
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
    label: "Station active?"
  },
  isDeleted: {
    type: Boolean,
    autoValue: function() {
      return false;
    }
  }
}));
