let {getUserInfo} = require('../../http/index.js');
Page({
  data: {
    indicatorDots: false,
    banner:[
      '../../assets/imgs/banner1@2x.png'
    ],
    noticeList: [
        {
            tip: '欢迎使用！',
        },
        {
            tip: '欢迎使用！',
        }
    ]
  },
  onLoad(e) {
  },
  // 跳相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    wx.navigateTo({
        url: `/pages/${page}/index`,
    })
  },
})
