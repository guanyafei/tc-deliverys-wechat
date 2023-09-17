const { request , request2 } = require('./request');
module.exports={
  // 有效范围市
  getopenacity:(firstCode)=>request('/admin/getOpenCityAddData','GET',{firstCode}),
  //省
  getadres:()=>request('/admin/getProAddData','GET',{}),
  //市
  getacity:(firstCode)=>request('/admin/getCityAddData','GET',{firstCode}),
  //区
  getacoun:(secondCode)=>request('/admin/getCountryAddData','GET',{secondCode}),
  // 街道
  getStreet:(thirdCode)=>request('/admin/getTownAddData','GET',{thirdCode}),
  // 支付
  getRequestPay:(data)=>request2('/oms/pay/requestPay','POST',data)
}