let {getListInvoice} = require('../../http/index.js');
let {checkIsNull} = require('../../utils/util');
Page({
  data: {
    list:[],
    searchValue:'',
    invoiceType:'',
    titleType:'',
  },
  onLoad(options) {  
    this.setData({
      invoiceType:options.invoiceType || '',
      titleType:options.titleType || ''
    });
    this.gotSearch();
  },
  gotSearch(){
    let userInfo = wx.getStorageSync('userInfo'); 
    let params={
      user_name:userInfo.userName,
      search_value:this.data.searchValue,
      authentication_type: this.data.invoiceType,
      rise_type: this.data.titleType,
    }
    getListInvoice(params).then(res=>{
      if(res.code == 200 && !checkIsNull(res.data)){
        let filterList = res.data || [];
        if(res.data.length>0 && !checkIsNull(this.data.invoiceType) && !checkIsNull(this.data.titleType)){
          filterList=res.data.filter(item=>{
              return item.riseType==this.data.titleType && item.authenticationType==this.data.invoiceType;
          });
        }
        this.setData({
          list:filterList
        });
      }
    });
  },
  // 选中抬头
  getSelectItem(e){
    let index = e.currentTarget.dataset.index,item = this.data.list[index];
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let invoiceType = 'params.invoiceType';
    let titleType = 'params.titleType';
    let title = 'params.title';
    let taxNo = 'params.taxNo';
    let telephone = 'params.telephone';
    let address = 'params.address';
    let receiveUserName = 'params.receiveUserName';
    let receiveUserAddress = 'params.receiveUserAddress';
    let receiveUserPhone = 'params.receiveUserPhone';
    let accountBank = 'params.accountBank';
    let bankNum = 'params.bankNum';
    let registerPhone = 'params.registerPhone';
    //修改上一个页面的变量
    prevPage.setData({
      [invoiceType]:item.authenticationType,
      [titleType]:item.riseType,
      [title]:item.invoiceRise,
      [taxNo]:item.businessDuty,
      [telephone]:item.phone,
      [address]:item.registerAddress,
      [receiveUserAddress]:item.receiveAddress,
      [receiveUserName]:item.receiveName,
      [receiveUserPhone]:item.receivePhone,
      [accountBank]:item.bankName,
      [bankNum]:item.bankAccount,
      [registerPhone]:item.registerTelephone
    });
    wx.navigateBack();
  }
})
