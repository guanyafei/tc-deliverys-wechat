let { checkIsNull } = require('../../utils/util');
Component({
  /**
   * 组件的初始数据
   */
  data: {
    firstDesc:'',
    addDesc:''
  },
  lifetimes:{
  },
  properties:{
    spendDetail:{
      type:Object,
      value:{}
    }
  },
  observers: {
    'spendDetail':function(val){ 
     if(!checkIsNull(val)){
      if(!checkIsNull(val.firstWeight)){
        this.setData({
          firstDesc:`首重(${val.firstWeight}kg)${val.firstWeightPrice}元`
        })
      }
      if(!checkIsNull(val.additionalWeight)){
        this.setData({
          addDesc:`,续重${val.additionalWeightPrice}元/kg`
        })
      }
     }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //关闭弹窗
    closed(){
      this.triggerEvent('closespenddetail');
    },
  }
})

