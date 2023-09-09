let {getLoginOut,getAuth}= require('../../http/index.js');
let {checkIsNull} = require('../../utils/util');
Page({
  data: {
    address:'',
    phonenumber:'',
    avatar:'../../assets/images/logo@2x.png',
    authFlag:false
  },
  onLoad() {
    let userInfo = wx.getStorageSync('userInfo'); 
    this.setData({
      address:userInfo.companyRegisteredAddress,
      phonenumber:userInfo.phonenumber,
      avatar:userInfo.avatar,
    });
  }, 
  onShow(){
    let userInfo = wx.getStorageSync('userInfo'); 
    let params = {
      customerAccount:userInfo.userName,
      customerPhone:userInfo.phonenumber
    }
    getAuth(params).then(res=>{
      if(res.code == 200){
        if(checkIsNull(res.data.idCard)){
            this.setData({
              authFlag:true
            });
        }
      }
    });
  },
  // 跳转相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    if(page == 'authenticate'){
      if(this.data.authFlag){
        wx.navigateTo({
          url: '/pagesB/authenticate/index',
        })
      }else{
        wx.showToast({
          title: '已实名认证！',
          icon:'none',
          duration: 3000
        })
      }
    }
  },
  onLoginOut(){
    getLoginOut().then(res=>{
      if(res.code == 200){
        wx.removeStorageSync('userInfo'); 
        wx.removeStorageSync('token'); 
        wx.switchTab({
          url:'/pages/home/index'
        })
      }
    });
  }
})
