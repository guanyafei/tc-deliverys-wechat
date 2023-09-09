let {getInvoiceDetail,getDeleteInvoice} = require('../../http/index.js');
Page({
  data: {
      //  type 1:企业  2:个人/非企业
      // header 1:电子普票 2：纸质专票
      obj:{}
  },
  onLoad(options) {
    let id = options.id;
    getInvoiceDetail(id).then(res=>{
      if(res.code==200){
        this.setData({
          obj:res.data || {}
        })
      }
    });
  },
  // 编辑
  goPage(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pagesC/invoiceHeader/index?page=edit&id='+id,
    })
  },
  // 删除抬头
  del(e){
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '系统提示',
      content: '是否删除当前抬头信息？',
      confirmText:'确定',
      confirmColor:'#466FED',
      cancelColor:'#2F2F2F',
      success:(res)=>{
        if (res.confirm) {
          getDeleteInvoice(id).then(res=>{
            if(res.code == 200){
              wx.navigateBack();
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
