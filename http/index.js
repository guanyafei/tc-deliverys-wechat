const { request , request2, request3 } = require('./request');
module.exports={
  // 有效范围省
  getopenadres:()=>request('/admin/getOpenProAddData','GET',{}),
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
  // 获取企业信息
  getEnterpriceInfo:(data)=>request(`/oms/website/checkEnterpriceBusinessInfo/${data}`,'GET',{}),
  // 注册
  getRegistry:(data)=>request('/admin/registry','POST',data),
  // 验证码
  getSms:(data)=>request('/admin/getSms','GET',data),
  // 重置密码
  getResetPassword:(data)=>request('/admin/resetPassword','POST',data),
  // 登录
  getLogin:(data)=>request('/admin/login','POST',data),
  // 退出
  getLoginOut:(data)=>request('/admin/logout','POST',data),
  // 获取用户信息
  getUserInfo:(data)=>request('/admin/getInfo','GET',{},data.tip,data.subTitle), 
  // 发票抬头新增
  getAddInvoice:(data)=>request('/oms/website/addInvoice','POST',data),
  // 发票抬头列表
  getListInvoice:(data)=>request('/oms/website/listInvoice','POST',data),
  // 发票抬头更新
  getEditInvoice:(data)=>request('/oms/website/editInvoice','PUT',data),
  // 发票抬头删除
  getDeleteInvoice:(data)=>request(`/oms/website/deleteInvoice/${data}`,'DELETE',{}),
  // 设置默认抬头
  setDefaultInvoice:(data)=>request(`/oms/website/setDefault/${data.id}/${data.userName}`,'GET',{}),
  // 发票抬头详情
  getInvoiceDetail:(data)=>request(`/oms/website/queryInvoice/${data}`,'GET',{}),
  // 待开发票列表
  getAwaitInvoiceBillList:(data)=>request(`/oms/invoice/bill/ome/listOrder?pageSize=${data.pageSize}&pageNum=${data.pageNum}`,'POST',{
    createTimeStart:data.createTimeStart,
    createTimeEnd:data.createTimeEnd,
    deliveryNo:data.deliveryNo || '',
  }),
  // 开票记录
  getInvoiceRecord:(data)=>request(`/oms/invoice/bill/ome/list?pageSize=${data.pageSize}&pageNum=${data.pageNum}`,'POST',{
    deliveryNo:data.deliveryNo || '',
    source:4,
  }),
  // 申请开票
  getAppInvoice:(data)=>request('/oms/invoice/bill/appInvoice','POST',data),
  // 发票换开
  getInvoiceChange:(data)=>request('/oms/invoice/bill/invoice/change','POST',data),
  // 订单详情
  getQueryOrders:(data)=>request('/oms/invoice/bill/queryOrders','GET',data),
  // 重新申请
  getInvoiceUpdate:(data)=>request('/oms/invoice/bill/appInvoice/update','POST',data),
  // 地址列表
  getBookList:(data)=>request(`/oms/website/getAddressBook?pageSize=${data.pageSize}&pageNum=${data.pageNum}`,"POST",{
    user_name:data.user_name,
    search_name:data.search_name,
    address_type:data.address_type
  }),
  // 地址删除
  getDelBook:(data)=>request(`/oms/website/deleteBook?ids=${data}`,"DELETE",{}),
  // 地址新增
  getAddBook:(data)=>request('/oms/website/addBook',"POST",data),
  // 地址修改
  getEditBook:(data)=>request('/oms/website/editBook',"PUT",data),
  // 违禁品文案
  getContrabandCopyWrite:()=>request('/oms/website/contrabandCopyWrite','GET',{}),
  // 违禁品查询接口
  getContraband:(data)=>request(`/oms/website/contraband/${data}`,'GET',{}),
  // 服务区域查询
  getServiceArea:(data)=>request(`/oms/website/serviceArea/${data}`,'GET',{}),
  // 产品服务
  getProductList:()=>request('/oms/website/product','GET',{}),
  // 增值服务
  getAppreciation:()=>request('/oms/website/appreciation','GET',{}),
  // 增值服务描述
  getAppreciationDocument:(data)=>request('/oms/website/appreciationDocument','POST',data),
  // 寄件时间获取
  getDeliveryTime:(data)=>request(`/oms/website/getDeliveryTime/${data}`,'GET',{}),
  // 运费时效
  getFreight:(data)=>request('/oms/website/freight','POST',data),
  // 创建订单
  createOrder:(data)=>request('/oms/order/createOrder','POST',data),
   // 操作记录
   operationRecord:(data)=>request('/oms/order/updateOrderRecord','GET',data),
  // 运单追踪
  getWaybillList:(data)=>request('/oms/header/listgw','GET',data),
  // 查询运单数量
  getQueryCount:(data)=>request('/oms/header/queryCountGW','POST',data),
  // 取消运单
  getCancelOrder:(data)=>request('/oms/order/cancelOrder','POST',data),
  // 获取寄件地址
  getSendAddressList:(data)=>request3('/shop/book/getSendAddressList','GET',data),
  // 提交地址搬迁申请
  getSubmitAddressMove:(data)=>request3('/shop/book/submitAddressMove','POST',data),
  // 搬迁地址审核状态查询
  getAddressMoveReviewStatus:(data)=>request3('/shop/review/getAddressMoveReviewStatus','GET',data),
  // 物品信息 物品名称
  getGoodsNameList:(data)=>request('/system/goods/listapp','GET',data),
  // 精确查询违禁品
  getChackContraband:(data)=>request('/system/contraband/chackContraband','GET',data),
  // 照片上传
  getUploadGFSImgFiles:(data)=>request('/oms/order/uploadGFSImgFiles','GET',data),
  // 应收运费
  getForecast:(data)=>request('/oms/order/forecast','POST',data),
  //运单详情
  getOrderInfo:(orderNo)=>request(`/oms/header/getInfo/${orderNo}`,'GET',{}),
  //查询包裹路由信息
  packageRouteInfo:(orderNo)=>request(`/oms/order/waybillRouteInfo/${orderNo}`,'GET',{}),
  // 货物比率
  getProductLTRatio:()=>request('/oms/tool/getProductLTRatio','GET',{}),
  // 货物规格限制
  getDataLimit:()=>request('/system/set/getData','GET',{}),
  // 获取站点详细信息
  getSortingCenterInfo:(data)=>request(`/oms/tool/getSortingCenterInfo/${data}`,'GET',{}),
  // 订单信息回显
  getOrderDetailsInfo:(data)=>request(`/oms/order/orderInfo/${data}`,'GET',{}),
  // 查询订单状态、支付状态
  getOrderStatus:(data)=>request(`/oms/order/status/${data}`,'GET',{}),
  // 查询电子回单图片
  getSelectOnlineSignImageByOrderNo:(data)=>request(`/oms/order/selectOnlineSignImageByOrderNo/${data}`,'GET',{}),
  // 实名认证
  getOauthRegistor:(data)=>request('/oms/oauth/customer/updateAuth','POST',data),
  // 获取实名认证信息
  getAuth:(data)=>request('/oms/oauth/customer/getAuth','GET',data),
  // 实名认证校验手机号 
  getCheckAuth:(data)=>request('/oms/oauth/customer/checkAuth','GET',data),
  // 二维码接口
  getQRCodeBase64:(data)=>request2('/oms/pay/getQRCodeBase64','GET',data),
  // 支付
  getRequestPay:(data)=>request2('/oms/pay/requestPay','POST',data),
  // 单个揽催
  getToCollect:(data)=>request('/oms/order/urgeCollectNotifyPDA','POST',data),
  // 设置默认地址
  setDefaultAddress:(data)=>request('/oms/website/setDefaultAddress','POST',data),
  // 认证 获取验证码
  getAuthCode:(data)=>request('/oms/oauth/customer/registor','POST',data),
}