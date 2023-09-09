Component({
  /**
   * 组件的初始数据
   */
  data: {
    list:[
      {
        title:'寄付月结',
        desc:'按月结算运维，需要提供月结账号',
        id:'1'
      },
      {
        title:'寄付现结',
        desc:'收货员取件后，可通过在线支付货扫收货员二维码进行支付',
        id:'2'
      },{
        title:'到付现结',
        desc:'收货员取件后，可通过在线支付货扫收货员二维码进行支付',
        id:'3'
      },
    ],
    desc:'',
    remarkLength:0,
    id:'',
    selectIndex:'',
    signCode:'',
  },
  lifetimes:{
    attached: function() {
      let userInfo = wx.getStorageSync('userInfo');
      let settlementType = userInfo.companySettlementType;
      if(settlementType == '1'){
        this.data.list.splice(0,1);
        this.setData({
          list:this.data.list
        });
      }else{
        this.setData({
          signCode:userInfo.companyMonthlyInvoicing || ''
        });
      }
      this.setData({
        id:this.data.list[0].id
      });
    }
  },
  properties:{
    settlementType:{
      type:Number,
      value:1
    }
  },
  observers:{
    'settlementType':function(val){
      let userInfo = wx.getStorageSync('userInfo');
      let settlementType = userInfo.companySettlementType;
      if(settlementType == 0){
        val == 0 ? this.setData({
          selectIndex:1
        }):this.setData({
          selectIndex:val
        });
      }else{
        this.setData({
          selectIndex:val == 0?2:val
        });
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 保存
    save(){
      let userInfo = wx.getStorageSync('userInfo');
      let settlementType = userInfo.companySettlementType;
      let payType={
        '1':'寄付月结',
        '2':'寄付现结',
        '3':'到付现结'
      }
      if(settlementType=='0' && this.data.id == '1'){
        let companyMonthlyInvoicing = userInfo.companyMonthlyInvoicing;
        payType = `${payType[this.data.id]} (${companyMonthlyInvoicing})`
      }else{
        payType = `${payType[this.data.id]}`
      }
      this.triggerEvent('getPayType',{params:this.data.id,payTypeDesc:payType});
    },
    // 选中
    selectItem(e){
      let index = e.currentTarget.dataset.index;
      this.setData({
        selectIndex:index,
        id:index
      })
    },
    //关闭弹窗
    closed(){
      this.triggerEvent('closePaytype',{params:false});
    },
  }
})

