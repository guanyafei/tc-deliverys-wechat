let {checkIsNull} = require('../../utils/util');
let {getUserInfo} = require('../../http/index.js');
Page({
  data: {
    avatar: '../../assets/imgs/tx@2x.png',
    userInfo:{
      nickName:'',
      consumerSignStatus:'',
      consumerName:'',
      userType:'',
      phonenumber:'',
      avatar:'',
      userName:''
    },
    signStatus:0
  },
  onLoad(e) {
  },  
  onShow(){
    console.log("show")
    // 获取用户信息
    let userInfo = wx.getStorageSync('userInfo'); 
    if(userInfo){
      this.setData({
        userInfo:Object.assign(this.data.userInfo,userInfo),
        signStatus:userInfo.consumerSignStatus
      });
    }else{
      this.setData({
        userInfo:{
          nickName:'',
          consumerSignStatus:'',
          consumerName:'',
          userType:'',
          phonenumber:'',
          avatar:'../../assets/images/logo@2x.png',
          userName:''
        }
      });
      // wx.clearStorage()
      // wx.showModal({
      //   title: '系统提示',
      //   content: '登录失效，是否重新登录?',
      //   confirmText:'确定',
      //   confirmColor:'#417CF7',
      //   success (res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //       wx.reLaunch({
      //         url: '/pagesB/login/index'
      //       }) 
      //     } else if (res.cancel) {
      //       wx.switchTab({
      //         url: '/pages/home/index'
      //       })
      //     }
      //   }
      // })
    }
  },
  // 跳转相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    wx.navigateTo({
        url: `/pages/${page}/index`,
    })
  },
  // 调取电话
  makeCall(){
    wx.makePhoneCall({
      phoneNumber: '400-128-8000' 
    })
  }
})
