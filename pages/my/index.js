let {checkIsNull} = require('../../utils/util');
let {getUserInfo} = require('../../http/index.js');
Page({
  data: {
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
    if(page == 'personal'){
      let token = wx.getStorageSync('token');
      if(checkIsNull(token)) return;
      wx.navigateTo({
        url: '/pagesB/personal/index',
      })
    }else if(page == 'serviceQuery'){
      wx.navigateTo({
        url: '/pagesB/service/index?type=serviceQuery',
      })
    }else if(page == 'news'){
      getUserInfo({
        tip:'登录提示',
        subTitle:'当前操作需要您进行登录'
      }).then(res=>{
        if(res.code==200){
          wx.navigateTo({
            url: '/pagesB/news/index',
          })
        }
      });
    }else if(page == 'invoice'){
      getUserInfo({
        tip:'登录提示',
        subTitle:'当前操作需要您进行登录'
      }).then(res=>{
        if(res.code==200){
          wx.navigateTo({
            url: '/pagesC/invoice/index',
          })
        }
      });
    }else if(page == 'addressBook'){
      let  token = wx.getStorageSync('token');
      if(checkIsNull(token)){
        wx.showModal({
          title: '登录提示',
          content: '当前操作需要您进行登录',
          confirmText:'确定',
          confirmColor:'#417CF7',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            //   wx.navigateTo({
            //     url: '/pagesB/login/index'
            //   })
            } else if (res.cancel) {
              wx.switchTab({
                url: '/pages/home/index'
              })
            }
          }
        })
      }else{
        wx.navigateTo({
          url: '/pagesC/addressBook/index',
        })
      }
    }else if(page == 'sendAddress'){
      wx.navigateTo({
        url: '/pagesC/sendAddress/index', 
      })
    }else if(page == 'login'){
      wx.navigateTo({
        url: '/pagesB/login/index',
      })
    }else if(page == 'register'){
      wx.navigateTo({
        url: '/pagesB/register/index',
      })
    }else if(page == 'service'){
      wx.navigateTo({
        url: '/pagesB/service/index',
      })
    }
  },
  // 调取电话
  makeCall(){
    wx.makePhoneCall({
      phoneNumber: '400-128-8000' 
    })
  }
})
