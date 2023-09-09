let {getSendAddressList,getAddressMoveReviewStatus} = require('../../http/index.js');
Page({
  data: {
    bookAddress:'',
    moveAddress:'',
    isReviewPassed:true
  },
  onLoad(e) {
  },
  onShow(){
    let userInfo = wx.getStorageSync('userInfo');
    // 获取申请状态
    getAddressMoveReviewStatus({
      consumerLoginNo:userInfo.userName
    }).then(res=>{
       if(res.code == 200){
         if(res.data.workResult ==1 || res.data.workResult ==2){
          this.setData({
           isReviewPassed:true,
           bookAddress:`${res.data.bookProvinceName} ${res.data.bookCityName} ${res.data.bookDistrictName} ${res.data.bookStreetName} ${res.data.newAddress}`,
           moveAddress:`${res.data.bookProvinceName}${res.data.bookCityName}${res.data.bookDistrictName}${res.data.bookStreetName}${res.data.newAddress}`
          });
         }else if(res.data.workResult == 0){
          this.setData({
            isReviewPassed:false,
            bookAddress:`${res.data.bookProvinceName} ${res.data.bookCityName} ${res.data.bookDistrictName} ${res.data.bookStreetName} ${res.data.newAddress}`,
           });
         }
       }
    });
  },
  // getSendAddressList(){
  //   let userInfo = wx.getStorageSync('userInfo');
  //   let params = {
  //     userName:userInfo.userName
  //   };
  //   getSendAddressList(params).then(res=>{
  //     if(res.code == 200){
  //       this.setData({
  //         bookAddress:`${res.data.bookProvinceName} ${res.data.bookCityName} ${res.data.bookDistrictName} ${res.data.bookStreetName} ${res.data.bookAddress}`,
  //         moveAddress:`${res.data.bookProvinceName}${res.data.bookCityName}${res.data.bookDistrictName}${res.data.bookStreetName}${res.data.bookAddress}`
  //       });
  //     }
  //   });
  // },
  // 跳转相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    if(page == 'sendAddressApply'){
      wx.navigateTo({
        url: '/pagesC/sendAddressApply/index',
      })
    }else if(page == 'sendAddressMove'){
      wx.navigateTo({
        url: '/pagesC/sendAddressMove/index?bookAddress='+this.data.moveAddress,
      })
    }
  }
})
