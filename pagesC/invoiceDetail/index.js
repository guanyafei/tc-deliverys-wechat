
Page({
  data: {
      params:{
        invoiceType:'',
        titleType:'',
        title:'',
        taxNo:'',
        telephone:'',
        invoiceAmount:'',
        receiveUserAddress:'',
        receiveUserName:'',
        receiveUserPhone:'',
        accountBank:'',
        bankNum:'',
        deliveryNos:'',
        orderNos:'',
        address:'',
        receiveInvoiceUser:'',
        checkInvoiceUser:'',
        createUser:'',
        createTime:'',
        ackTime:'',
        downloadUrl:''
      },
  },
  onLoad(options) {
    this.setData({
      params:JSON.parse(options.invoiceItem)
    })
  },
  // 下载
  downLoad(e){
    let downloadUrl = this.data.params.downloadUrl;
    let fileName = new Date().valueOf();
    let filePath = wx.env.USER_DATA_PATH + '/' + fileName + '.jpg'
    wx.showLoading({
      title: '下载中',
    })
    wx.downloadFile({
      url: 'http:'+downloadUrl,
      filePath: filePath,
      success: res => {
        if (res.statusCode == 200){
           wx.saveImageToPhotosAlbum({
             filePath: filePath,
             success:function(){
              wx.hideLoading();
              wx.showToast({
                title: '文件已保存到您的手机相册',
                icon:'none',
                duration: 3000
              })
             },
             fail:function(err){
              console.log("saveImageToPhotosAlbum",err)
             }
           })
        }
      },
      fail:function(err){
        wx.hideLoading();
        if(err.errMsg  === 'saveImageToPhotosAlbum:fail auth deny'){
          wx.openSetting({
            success(setting){
              console.log("setting",setting)
              if(setting.authSetting['scope.writePhotosAlbum']){
                wx.showToast({
                  title: '请再次点击下载',
                  icon:'none',
                  duration: 3000
                });
              }
            }
          })
        }
      }
    });
  },
  // 跳转相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    if(page == 'invoiceOrderList'){
      wx.navigateTo({
        url: `/pagesC/invoiceOrderList/index?invoiceNo=${this.data.params.invoiceNo}`,
      })
    }else if(page == 'invoiceApply'){
      let invoiceItem = JSON.stringify(this.data.params);
      let status =  e.currentTarget.dataset.status;
      wx.navigateTo({
        url: `/pagesC/invoiceApply/index?invoiceDeliveryNoList=${this.data.params.deliveryNos}&orderNoList=${this.data.params.orderNos}&totalPrice=${this.data.params.invoiceAmount}&invoiceItem=${invoiceItem}&status=${status}`,
      })
    }else if(page == 'invoiceImg'){
      wx.navigateTo({
        url: `/pagesC/invoiceImg/index?invoiceImg=${this.data.params.downloadUrl}`,
      })
    }
  }
})
