Template.bankAccounts.helpers({
  bankAccounts: function() {
    return Mart.BankAccounts.find().count() > 0
  },
  defaultBankAccount: function() {
    return Mart.BankAccounts.findOne({isDefault: true})
  },
  savedBankAccounts: function() {
    return Mart.BankAccounts.find({isDefault: false})
  }
});
