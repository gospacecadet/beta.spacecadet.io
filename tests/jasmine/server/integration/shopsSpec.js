describe('Collection: Shops', function () {

  it('works', function () {
    var shop = Meteor.call('fixtures/shops/create');
    expect(shop.name).toBe("marvin");
  })

});
