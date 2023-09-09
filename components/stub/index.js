let { checkIsNull, accAdd, accMul } = require('../../utils/util');
Component({
  /**
   * 组件的初始数据
   */
  data: {
    senderFlag: true,
    reciverFlag: true,
    bzPrice:null,
    qdPrice:null,
    bjPrice:null,
  },
  properties: {
    detail: {
      type: Object
    },
    detailNum: {
      type: Object
    }
  },
  observers: {
    'detailNum': function (val) {
      if(!checkIsNull(val)){
        this.setPrice();
      }
    },
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
        if(addedList[i].serviceCode=='IP'){
          this.data.bjPrice = addedList[i].serviceCharge;
          // this.data.bjPrice = accAdd(this.data.bjPrice || 0, addedList[i].children[0].valuationCharge || 0);
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
    // 展示、隐藏电话号码
    onSee(e) {
      let type = e.currentTarget.dataset.type;
      console.log(type)
      let param = `${type}Flag`;
      this.setData({
        [param]: !this.data[param]
      })
    }
  }
})