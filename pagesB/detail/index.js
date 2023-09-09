let {
  getOrderInfo,
  packageRouteInfo
} = require('../../http/index.js');
Page({
  data: {
    orderNo: '',
    orderTime: '',
    showIndex: 1,
    nodateFlag: false,
    copyToast: false,
    status: 3,
    detail: {},
    packageRouteInfo: [],
    imageUrl: '',
    waybillNo:'',
    itemIndex:'',//1:我的邮寄 2:我的收取 3:待支付
  },
  onLoad(options) {
    this.setData({
      orderNo: options.orderNo,
      orderTime: options.orderTime,
      itemIndex: options.itemIndex
    })
  },
  onShow() {
    this.getDetail()
  },
  // 唤起电话
  makeCall(e){
    let tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  getDetail() {
    let orderNo = this.data.orderNo;
    getOrderInfo(orderNo).then(data => {
      if(data.code == 200){
        this.setData({
          waybillNo: data.data.omsOrderHeaderVo.waybillNo, 
          detail: data.data
        });
      }
    })
  }, 
  // 去支付跳页面
  goPage(e) {
    wx.navigateTo({
      url: '/pages/pay/index?orderNo='+this.data.orderNo+'&orderTime='+this.data.orderTime,
    })
  },
  // 复制
  copyOrderNo(e) {
    let no = e.currentTarget.dataset.transferno;
      wx.setClipboardData({
        data: no,
        success: (res) => {
          wx.hideToast();
          wx.getClipboardData({
            success:()=> {
              wx.hideToast();
              this.setData({
                copyToast: true
              });
              let timer = setTimeout(() => {
                clearTimeout(timer);
                this.setData({
                  copyToast: false
                });
              }, 1000)
            }
          })
        },
        fail: (res) => {
          console.log("setClipboardData", res)
        }
      })
  },
  // 
  clickItem(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      showIndex: index
    })
    if (this.data.showIndex == 2) {
      let orderNo = this.data.orderNo
      packageRouteInfo(orderNo).then(data => {
        this.setData({
          packageRouteInfo: data.data
        })
      })
    } else if (this.data.showIndex == 3) {

    }
  }
})