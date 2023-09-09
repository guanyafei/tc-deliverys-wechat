let {getSelectOnlineSignImageByOrderNo,getOrderInfo,packageRouteInfo} = require('../../http/index.js');
let {checkIsNull} = require('../../utils/util');
Component({
  /**
   * 组件的初始数据
   */
  data: {
    returnWaybillDetail:{},
    packageRouteInfo:{}
  },
  lifetimes:{
    attached: function() {
      // 电子回单
      if(this.data.detail.onlineSignStatus == 3 && !checkIsNull(this.data.detail.orderNo)){
        getSelectOnlineSignImageByOrderNo(this.data.detail.orderNo).then(res=>{
          if(res.code == 200 && res.data.length>0){
            this.setData({
              imageUrl:res.data[0].imageUrl
            })
          }
        });
      }
      // 纸质回单
      if(this.data.detail.offlineSignStatus==3 && this.data.detail.returnWaybillNo){
        getOrderInfo(this.data.detail.returnOrderNo).then(res=>{
          if(res.code == 200){
              this.setData({
                returnWaybillDetail: res.data.omsOrderHeaderVo
              });
          }
        });
        packageRouteInfo(this.data.detail.returnOrderNo).then(data => {
          this.setData({
            packageRouteInfo: data.data
          })
        })
      }
    },
  },
  properties:{
    detail:{
      type:Object
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 返回
    goQuery(e){
      let no =  e.currentTarget.dataset.waybillno;
        // 获取上个页面对象
      let pages = getCurrentPages();
      //获取上一个页面
      let prevPage = pages[pages.length - 2]; 
      let transferNo = "params.transferNo";
      prevPage.setData({
        [transferNo]:no
      });
      prevPage.onDetailToQuery();
      wx.navigateBack();
    },
    previewImage(e){
      let img = e.currentTarget.dataset.img;
      wx.previewImage({
        current: img, // 当前显示图片的http链接
        urls: [img] // 需要预览的图片http链接列表
      })
    }
  }
})

