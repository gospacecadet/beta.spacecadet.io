"use strict";
describe("Stations", function () {
  it("should be created with name", function () {
    spyOn(Stations, "insert").and.callFake(function(doc, callback) {
      // simulate async return of id = "1";
      callback(null, "1");
    });

    var stationName = "Station 1";
    var station = new Station(stationName);

    expect(station.name).toBe(stationName);

    station.save();

    // id should be defined
    expect(station.id).toEqual("1");
    expect(Stations.insert).toHaveBeenCalledWith({
      name: stationName,
      landlordId: null
    }, jasmine.any(Function));
  });

  it("should not save when name is not defined", function() {
    var station = new Station(null);
    expect(function() { station.save(); }).toThrow();
  });
});