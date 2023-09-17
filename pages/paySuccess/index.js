
Page({
  data: {
    orderNo:'',
    showToast:false,
    price:'100'
  },
  onLoad(e) {
    let no = e.orderNo;
    let price = e.price;
    this.setData({
      orderNo:no,
      price:price
    })
  },
  // 复制运单号
  copyOrderNo(){
    wx.setClipboardData({
      data: this.data.orderNo,
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
    wx.switchTab({
        url: `/pages/${page}/index`,
    })
  }
})
