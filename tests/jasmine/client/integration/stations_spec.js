"use strict";
describe("Stations", function () {
  var stationName = "Station Name";

  it("can be created by landlords", function (done) {
    // login to system and wait for callback
    Meteor.loginWithPassword("landlord@spacecadet.io", "password", function(err) {
      // check if we have correctly logged in the system
      expect(err).toBeUndefined();

      // create a new Station
      var station = new Station(stationName);

      // save the station and use callback function to check for existence
      var id = station.save(function(error, result) {
        expect(error).toBeUndefined();

        // delete created station
        Stations.remove(id);

        Meteor.logout(function() {
          done();
        });
      });
    });
  });

  it("cannot be created by any role other than landlord", function(done) {
    // login and wait for callback
    Meteor.loginWithPassword("user@spacecadet.io", "password", function(err) {
      // ensure correctly logged in
      expect(err).toBeUndefined();

      // create a new Station
      var station = new Station(stationName);

      // save station and call callback
      var id = station.save(function(error, result) {
        expect(error.error).toBe(403);

        Meteor.logout(function() {
          done();
        });
      });
    })
  });
});