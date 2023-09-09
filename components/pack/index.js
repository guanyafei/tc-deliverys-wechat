let {checkNonZeroHead} = require('../../utils/util');
Component({
  /**
   * 组件的初始数据
   */
  data: {
    weight:'',
    selectList:[],
    params:{},
    initList:[]
  },
  properties:{
    addedPackList:{
      type:Array,
      value:[]
    },
    hasSelectedPackList:{
      type:Array,
      value:[]
    }
  },
  observers: {
    'addedPackList':function(val){
      this.setData({
        initList:val,
      });
    },
    'hasSelectedPackList':function(val){
      if(val.length>0){
        let obj = {};
        for(let i = 0,valLen=val.length; i < valLen; i++) {
          for(let j = 0,len=this.data.addedPackList.length; j < len; j++) {
              if(val[i].serviceCode == this.data.addedPackList[j].twoCode){
                this.data.addedPackList[j].num = val[i].serviceNum;
                this.data.selectList.push(val[i].serviceCode);
                obj[j]=val[i];
              }
          }
        }
        this.setData({
          addedPackList:this.data.addedPackList,
          selectList:this.data.selectList,
          params:obj
        });
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //关闭弹窗
    closed(){
      this.triggerEvent('closePack',{params:false});
    },
    // 确定
    save(){
      this.triggerEvent('getPack',{params:this.data.params});
    },
    // 加
    add(e){
      let index = e.currentTarget.dataset.index;
      this.onCheckData(index);
      this.data.addedPackList[index].num++;
      this.data.params[index].serviceNum =  this.data.addedPackList[index].num;
      this.setData({
        addedPackList: this.data.addedPackList
      })
    },
    // 减
    reduce(e){
      let index = e.currentTarget.dataset.index;
      this.data.addedPackList[index].num--;
      if(this.data.addedPackList[index].num <= 0){
        this.data.addedPackList[index].num++;
      }
      this.data.params[index].serviceNum =  this.data.addedPackList[index].num;
      this.setData({
        addedPackList: this.data.addedPackList
      })
    },
    // 选中包装项目
    selectItem(e){
      let index = e.currentTarget.dataset.index;
      let item = this.data.addedPackList[index];
      if(this.data.selectList.includes(item.twoCode)){
        this.data.selectList.splice(this.data.selectList.indexOf(item.twoCode),1);
        this.data.addedPackList[index].num = 0;
        delete this.data.params[index];
      }else{
        this.data.selectList.push(item.twoCode);
        this.data.addedPackList[index].num = 1;
        this.data.params[index] = {
          serviceCode:this.data.addedPackList[index].twoCode,
          serviceName:this.data.addedPackList[index].twoName,
          serviceNum:this.data.addedPackList[index].num,
          serviceCharge:this.data.addedPackList[index].isShow == '1'?this.data.addedPackList[index].showPrice:null
        }
      }
      this.setData({
        addedPackList:this.data.addedPackList
      });
    },
    // 校验个数值
    getNum(e){
      let index = e.currentTarget.dataset.index;
      let val = checkNonZeroHead(e.detail.value); 
      this.data.addedPackList[index].num = val;
      this.data.params[index].serviceNum =  this.data.addedPackList[index].num;
      this.setData({
        addedPackList: this.data.addedPackList
      });
    },
    // 获取焦点设置文本框
    resetFocusInput(e){
      let index = e.currentTarget.dataset.index;
      this.onCheckData(index);
      if(this.data.addedPackList[index].num == 0){
        this.data.addedPackList[index].num = null
      }
      this.setData({
        addedPackList: this.data.addedPackList
      })
    },
    // 获取焦点 点击增加按钮 数据检测处理
    onCheckData(index){
      let item = this.data.addedPackList[index];
      if(!this.data.selectList.includes(item.twoCode)){
        this.data.selectList.push(item.twoCode);
        this.data.addedPackList[index].num = 0;
        this.data.params[index] = {
          serviceCode:this.data.addedPackList[index].twoCode,
          serviceName:this.data.addedPackList[index].twoName,
          serviceNum:this.data.addedPackList[index].num,
          serviceCharge:this.data.addedPackList[index].isShow == '1'?this.data.addedPackList[index].showPrice:null
        };
        this.setData({
          addedPackList: this.data.addedPackList,
          selectList:this.data.selectList
        })
      }
    },
    // 失去焦点重置文本框
    resetBlurInput(e){
      let index = e.currentTarget.dataset.index;
      if(this.data.addedPackList[index].num == null){
        this.data.addedPackList[index].num = 0;
        this.setData({
          addedPackList: this.data.addedPackList
        })
      }
    }
  }
})

