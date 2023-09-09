Component({
  /**
   * 组件的初始数据
   */
  data: {
    remarkLength:0,
    selectIndex:-1,
    desc:'',
    params:{
      serviceCode:'',
      serviceName:'',
      serviceCharge:'',
      remark:''
    }
  },
  properties:{
    addedCashBackList:{
      type:Array,
      value:[]
    },
    hasSelectedCashBackList:{
      type:Array,
      value:[]
    }
  },
  observers:{
    'addedCashBackList':function(val){
      if(this.data.hasSelectedCashBackList.length>0){
        for(let i=0;i<val.length;i++){
          if(val[i].twoCode == this.data.hasSelectedCashBackList[0].serviceCode){
            this.setData({
              selectIndex:i
            })
          }
        }
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 阻止蒙板滑动穿透
    preventMove(){

    },
    // 备注输入
    onInputRemark(e){
      let remark = e.detail.value;
      let desc = 'params.remark';
      this.setData({
        remarkLength:remark.length,
        [desc]:`${this.data.params.serviceName} (${remark})`
      });
    },
    // 单选
    selectItem(e){
      let index = e.currentTarget.dataset.index;
      let item = this.data.addedCashBackList[index];
      if(item.twoCode == 'ESR'){
        this.setData({
          desc:''
        });
      }
      this.setData({
        selectIndex:index,
        params:{
          serviceCode:item.twoCode,
          serviceName:item.twoName,
          serviceCharge:item.isShow=='1'?item.showPrice:'',
        }
      });
      console.log("nnnnnnnnnn",this.data.params)
    },
    // 保存
    save(e){
      this.triggerEvent('getCashPack',{params:this.data.params});
    },
    //关闭弹窗
    closed(){
      this.triggerEvent('closeCashBack',{params:false});
    },
  }
})

