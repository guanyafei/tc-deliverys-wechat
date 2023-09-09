let { checkIsNull, accAdd, accMul } = require('../../utils/util');
Component({
  /**
   * 组件的初始数据
   */
  data: {
    bzPrice:null,
    qdPrice:null,
    bjPrice:null,
    userTypeDesc:'寄方合计费用：'
  },
  lifetimes:{
  },
  properties:{
    msg:{
      type:String,
      value:''
    },
    detail:{
      type:Object
    },
    detailNum:{
      type:Object
    },
    itemIndex:{
      type:''
    }
  },
  observers: {
    'detailNum': function (val) {
      if(!checkIsNull(val)){
        this.setPrice();
      }
      this.setData({
        selectIndex: -1,
      });
    },
    'itemIndex':function(val){
      let desc = '寄方合计费用：';
      if(!checkIsNull(val)){
        if(val=='1'){
          desc = '寄方合计费用：';
        }else if(val=='2'){
          desc = '收方合计费用：';
        }else if(val == '3'){
          let userInfo = wx.getStorageSync('userInfo');
          let userName = userInfo.userName;
          if(!checkIsNull(this.data.detail.consigneeCustomerAccount) && this.data.detail.consigneeCustomerAccount == userName){
            desc = '收方合计费用：';
          }
          if(!checkIsNull(this.data.detail.consignorCustomerAccount) && this.data.detail.consignorCustomerAccount == userName){
            desc = '寄方合计费用：';
          }
        }
      }
      this.setData({
        userTypeDesc:desc
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 计算价格
    setPrice(){
      let addedList = this.data.detailNum.orderServiceDetailVos;
      this.data.bzPrice = 0;
      this.data.qdPrice = 0;
      this.data.bjPrice = 0;
      for(let i=0;i<addedList.length;i++){
        if(addedList[i].serviceCode=='PK'){
          this.data.bzPrice = addedList[i].serviceCharge;
          // for(let j=0;j<addedList[i].children.length;j++){
          //   this.data.bzPrice = accAdd(this.data.bzPrice || 0, accMul(addedList[i].children[j].serviceCharge || 0, addedList[i].children[j].serviceNum));
          // }
        }
        if(addedList[i].serviceCode=='IP' ){
          this.data.bjPrice= addedList[i].serviceCharge;
          // this.data.bjPrice= accAdd(this.data.bjPrice || 0, addedList[i].children[0].serviceCharge || 0)
        }
        if(addedList[i].serviceCode=='SR'){
          this.data.qdPrice = addedList[i].serviceCharge;
          // this.data.qdPrice = accAdd(this.data.qdPrice || 0, addedList[i].children[0].serviceCharge || 0)
        }
      }
      this.setData({
        bzPrice:this.data.bzPrice,
        qdPrice:this.data.qdPrice,
        bjPrice:this.data.bjPrice,
      });
    },
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
    }
  }
})

