let {getRequestPay} = require('../../http/index.js');
Page({ 
  data: {
    urlAgrs:{}
  },
  onLoad(e) {
    let q = decodeURIComponent(decodeURIComponent(e.q));
    let obj = this.getUrlArgs(q);
    this.setData({
      urlAgrs:obj
    });
    let that = this;
    wx.login({
      success(res){
        if(res.errMsg == 'login:ok'){
          let params = {
            code:res.code,
            payment_no:that.data.urlAgrs['payment_no'],
            pay_type:'2',
            final_price: that.data.urlAgrs['final_price'],
          }
          that.getRequestPayParams(params);
        }
      }
    });
  },
  // 获取支付参数 
  getRequestPayParams(params){
    let that = this;
    getRequestPay(params).then(res=>{
      if(res.responseCode == 200){
       let responseData = JSON.parse(res.responseData);
       if (responseData['op_ret_code'] == '000') {
        let trans_data = JSON.parse(responseData['trans_data']);
        let params = {
            timeStamp:trans_data.timeStamp || '',
            nonceStr:trans_data.nonceStr || '',
            package:trans_data.package || '',
            signType:trans_data.signType || '',
            paySign:trans_data.paySign || '',
        };
        that.pay(params);
       }else{
          wx.showToast({
            title: responseData['op_err_msg'],
            icon:'none',
            duration: 3000
          })
       }
      }
    });
  },
  // 获取url参数
  getUrlArgs(urlStr) {
    let urlAgrs = {};
    let urlStrArr = urlStr.split('?');
    for (let i = 1; i < urlStrArr.length; i++) {
      urlStrArr[i] && urlStrArr[i].split('&').map(item => {
          urlAgrs[item.split('=')[0]] = decodeURIComponent(item.split('=')[1]);
      });
    }
    return urlAgrs;
  },
  // 支付
  pay(params){
    wx.requestPayment({
      ...params,
      success:(res)=>{
        if(res.errMsg == 'requestPayment:ok'){ 
          wx.showToast({
            title: '支付成功',
            icon:'none',
            duration: 3000
          });
          wx.exitMiniProgram({
            success: function() {
            },
            fail: function() {
            }
          })
        }
      },
      fail:(res)=>{
        if(res.errMsg == 'requestPayment:fail cancel'){
          wx.showToast({
            title: '支付取消',
            icon:'none',
            duration: 3000
          })
        }else{
          wx.showToast({
            title: '支付失败',
            icon:'none',
            duration: 3000
          })
        }
        return;
      },
    })
  }
})
