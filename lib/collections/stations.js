Stations = new Mongo.Collection("stations");

Stations.permit(['insert', 'update', 'remove']).never().apply();
Stations.permit(['insert', 'update']).ifLoggedIn().apply();

Stations.attachSchema(new SimpleSchema({
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
  ownerId: {
    type: String,
    autoValue: function() {
      return this.userId;
    }
  },
}));
