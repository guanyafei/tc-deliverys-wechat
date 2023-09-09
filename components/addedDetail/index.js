Component({
  /**
   * 组件的初始数据
   */
  data: {
  },
  lifetimes:{
  },
  properties:{
    packTotal:{
      type:String,
      value:'0.00'
    },
    cashBackTotal:{
      type:String,
      value:'0.00'
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //关闭弹窗
    closed(){
      this.triggerEvent('closeaddeddetail',{params:false});
    },
  }
})

