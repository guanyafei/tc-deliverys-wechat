let {getOrderDetailsInfo,getQRCodeBase64,getRequestPay} = require('../../http/index.js');
let {Subtr} = require('../../utils/util');
Page({
  data: {
    orderNo:'',
    totalPrice:'',
    orderTime:'',
    addedValue:'',
    basePrice:'',
    serialNum:'',
    baseFreigtDiscount:''
  },
  onLoad(e) {
    let orderNo = e.orderNo;
    let orderTime = e.orderTime;
    this.setData({
      orderNo:orderNo,
      orderTime:orderTime
    });
    getQRCodeBase64({
      content:orderNo
    }).then(res=>{
        if(res.code == 200){
          this.setData({
            serialNum:res.result
          })
        }
    });
    getOrderDetailsInfo(orderNo).then(res=>{
       if(res.code == 200){
          this.setData({
            totalPrice:res.data.sumPrice || 0,
            baseFreigtDiscount:res.data.baseFreigtDiscount || 0,
            addedValue:res.data.servicePrice|| 0, 
            basePrice:res.data.baseFreigt || 0 
          });
       }
    });
  },
  goPage(){
    let serialNum =this.data.serialNum;
    let totalPrice = this.data.totalPrice;
    let that = this;
    wx.login({
      success(res){
        if(res.errMsg == 'login:ok'){
          getRequestPay({ 
            code:res.code,
            payment_no:serialNum,
            pay_type:'2',
            final_price: totalPrice
          }).then(res=>{
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
        }
      }
    });
  },
  // 支付
  pay(params){
    let that = this;
    wx.requestPayment({
      ...params,
      success:(res)=>{
        if(res.errMsg == 'requestPayment:ok'){
          wx.navigateTo({
            url:`/pages/paySuccess/index?price=${that.data.totalPrice}&orderNo=${that.data.orderNo}`
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
