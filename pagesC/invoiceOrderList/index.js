let {getQueryOrders} = require('../../http/index.js');
Page({
  data: {
    list:[]
  },
  onLoad(options) {
    let params={
      invoiceNo:options.invoiceNo
    }
    getQueryOrders(params).then(res=>{
      if(res.code == 200){
         this.setData({
          list:res.data || []
         })
      }
    });
  },
})
