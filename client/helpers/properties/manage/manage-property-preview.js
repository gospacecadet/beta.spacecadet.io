Template.managePropertyPreview.helpers({
  hasSpaces: function() {
    return Mart.Products.find({storefrontId: this._id}).count() > 0
  }
});
