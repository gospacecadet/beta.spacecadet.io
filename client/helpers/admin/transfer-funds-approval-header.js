Template.transferFundsApprovalHeader.helpers({
  merchantHasBankAccount: function(){
    return Mart.BankAccounts.findOne({userId: this.merchantId, isDefault: true})
  }
});
