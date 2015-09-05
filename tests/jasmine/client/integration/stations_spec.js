"use strict";
describe("Stations", function () {
  it("can be created by landlords", function (done) {
    // login to system and wait for callback
    Meteor.loginWithPassword("landlord@spacecadet.io", "password", function(err) {
      // check if we have correctly logged in the system
      expect(err).toBeUndefined();

      // create a new Station
      var station = new Station();

      // save the station and use callback function to check for existence
      var id = station.save(function(error, result) {
        expect(error).toBeUndefined();

        // delete created station
        Stations.remove(id);

        Meteor.logout(function() {
          done();
        })
      });
    });
  });
});