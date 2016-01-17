Template.spaceCardButtons.helpers({
  landlordThread: function() {
    var _landlordId = landlordId(this._id)
    if(_landlordId)
      return Talk.thread(_landlordId)
  },
});

var landlordId = function(spaceId) {
  var space = Mart.Products.findOne(spaceId)
  if(!space)
    return

  var property = Mart.Storefronts.findOne(space.storefrontId)
  if(property)
    return property.userId
}
