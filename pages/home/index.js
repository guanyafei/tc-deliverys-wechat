let {getUserInfo} = require('../../http/index.js');
Page({
  data: {
    indicatorDots: false,
    banner:[
      '../../assets/imgs/banner1@2x.png'
    ],
    hornIcon: '../../assets/imgs/lb@2x.png',
    noticeList: [
        {
            tip: '欢迎使用！',
        },
        {
            tip: '欢迎使用！',
        }
    ],
    orderIcon: '../../assets/imgs/xd@2x.png'
  },
  onLoad(e) {
  },
  // 跳相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    if(page == 'order'){
      getUserInfo({
        tip:'登录提示',
        subTitle:'当前操作需要您进行登录'
      }).then(res=>{
        if(res.code==200){
          wx.navigateTo({
            url: '/pages/order/index',
          })
        }
      });
    }else if(page == 'service'){
      wx.navigateTo({
        url: '/pagesB/service/index?type=service',
      })
    }else if(page == 'goodsDesc'){
      wx.navigateTo({
        url: '/pagesB/service/index?type=goodsDesc',
      })
    }else if(page == 'aging'){
      getUserInfo({
        tip:'登录提示',
        subTitle:'当前操作需要您进行登录'
      }).then(res=>{
        if(res.code==200){
          wx.navigateTo({
            url: '/pagesB/aging/index',
          })
        }
      });
    }else if(page == 'contraband'){
      getUserInfo({
        tip:'登录提示',
        subTitle:'当前操作需要您进行登录'
      }).then(res=>{
        if(res.code==200){
          wx.navigateTo({
            url: '/pages/contraband/index', 
          })
        }
      });
    }else if(page == 'serviceArea'){ 
      getUserInfo({
        tip:'登录提示',
        subTitle:'当前操作需要您进行登录'
      }).then(res=>{
        if(res.code==200){
          wx.navigateTo({
            url: '/pagesB/serviceArea/index',
          })
        }
      });
    }else if(page == 'codePay'){
      wx.navigateTo({
        url: '/pages/codePay/index',
      })
    }
  },
})
