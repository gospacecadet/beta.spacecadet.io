Template.spaceTopImageAndButtons.helpers({
  thumbnailUrl: function() {
    console.log('thumbnailUrl');
    console.log(this);
    let img = Mart.Images.findOne({objectId: this._id, objectCollection: "Products"})

    if(img)
      return img.thumbnailUrl
  }
});

Template.space.onCreated(function() {
  var productId = Template.currentData()._id
  Meteor.subscribe("mart/images/product", productId);
})

Template.spaceTopUnitSelection.helpers({
  hourlyPrice: function() {
    console.log('hourlyPrice');
    console.log(this);
    // Mart.Prices.find()
    return "$10"
  },
  dailyPrice: function() {
    return "$100"
  },
  monthlyPrice: function() {
    return "$1000"
  }
});
