Page({
  data: {
    waybillNo:'',
    orderNo:'',
    showToast:false,
  },
  onLoad(e) {
    let waybillNo = e.waybillNo;
    let orderNo = e.orderNo;
    this.setData({
      waybillNo:waybillNo,
      orderNo:orderNo,
     });
  },
  // 复制运单号
  copyOrderNo(){
    wx.setClipboardData({
      data: this.data.waybillNo,
      success: (res)=> {
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
      }
    })
  },
  // 跳页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    if(page == 'order'){
      wx.navigateTo({
        url: `/pages/order/index?orderNo=${this.data.orderNo}&type=zlyd`,
      })
    }else if(page == 'query'){
      wx.switchTab({
        url: '/pages/query/index',
      })
    }
  }
})
