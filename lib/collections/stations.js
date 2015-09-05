Stations = new Mongo.Collection('stations');

Station = function (id, name) {
  this._id = id;
  this._name = name;
};

Station.prototype = {
  get id() {
    // readonly
    return this._id;
  },
  get name() {
    return this._name;
  },
  set name(value) {
    this._name = value;
  },
  save: function(callback) {
    // remember the context since in callback it is changed
    var that = this;
    var station = {
      name: this.name,
      landlordId: Meteor.userId()
    };

    Stations.insert(station, function(error, result) {
      that._id = result;

      if (callback != null) {
        callback.call(that, error, result);
      }
    });
  }
};

Stations.allow({
  insert: function (userId, station) {
    // the user must be logged in, and the station must be owned by the user
    return (
      userId &&
      station.landlordId === Meteor.userId() &&
      Roles.userIsInRole(userId, "landlord")
    );
  }
});