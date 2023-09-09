let {getAppreciation} = require('../../http/index.js');
let {accAdd,accMul,Subtr} = require('../../utils/util');
Page({
  data: {
    showAddedDetail:false,
    showPack:false,
    showCashBack:false,
    list:[],
    addedPackList:[],
    addedCashBackList:[],
    addedInsuredList:[],
    selectList:[],
    hasSelectedPackList:[],
    hasSelectedCashBackList:[],
    packTotal:0,
    cashBackTotal:0,
    allTotal:0,
    addedValuedDesc:'',
    initList:[],
  },
  onLoad(e) {
    let addedValueList = JSON.parse(e.addValuedList);
    let addedValuedStr = [];
    if(addedValueList.length>0){
      for(let i=0;i<addedValueList.length;i++){
        if(addedValueList[i].serviceCode == 'PK'){
          this.setData({
           hasSelectedPackList:addedValueList[i].details
          });
          for(let j=0;j<addedValueList[i].details.length;j++){
            addedValuedStr.push(`${addedValueList[i].details[j].serviceName}x${addedValueList[i].details[j].serviceNum} ¥${addedValueList[i].details[j].serviceCharge}*${addedValueList[i].details[j].serviceNum}`);
          }
        }
        if(addedValueList[i].serviceCode == 'SR'){
         this.setData({
           hasSelectedCashBackList:addedValueList[i].details
         });
       }
       if(addedValueList[i].serviceCode == 'IP'){
         this.setData({
          addedInsuredList:addedValueList[i]
         })
       }
       this.data.selectList.push(addedValueList[i].serviceCode);
     }
     this.getCalculate();
     this.setData({
       selectList:this.data.selectList,
       initList:addedValueList,
       addedValuedDesc:addedValuedStr.join(' | ')
     });
    }
    getAppreciation().then(res=>{
       if(res.code == 200){
         this.setData({
           list:res.data
         })
       }
    });
  },
  // 计算
  getCalculate(){
    this.data.packTotal = 0;
    this.data.cashBackTotal = 0;
    this.data.allTotal = 0;
    for(let j=0;j<this.data.hasSelectedPackList.length;j++){
      this.data.packTotal=accAdd(this.data.packTotal || 0,accMul(this.data.hasSelectedPackList[j].serviceCharge || 0,this.data.hasSelectedPackList[j].serviceNum));
    }
    for(let j=0;j<this.data.hasSelectedCashBackList.length;j++){
      this.data.cashBackTotal=this.data.hasSelectedCashBackList[j].serviceCharge !=''?this.data.hasSelectedCashBackList[j].serviceCharge:0;
    }
    this.setData({
      packTotal:this.data.packTotal,
      cashBackTotal:this.data.cashBackTotal,
      allTotal:accAdd(this.data.packTotal || 0,this.data.cashBackTotal || 0),
    });
  },
  // 确定
  save(){
    let pages = getCurrentPages();
    //获取上一个页面
    let prevPage = pages[pages.length - 2];
    let packListValue = [],cashBackList=[];
    let addedValuedStr = [];
    for(let i=0;i<this.data.list.length;i++){
      if(this.data.list[i].oneCode == 'PK' && this.data.hasSelectedPackList.length>0){
        packListValue = [
          {
            serviceCharge:this.data.packTotal,
            serviceName:this.data.list[i].oneName,
            serviceCode:'PK',
            details:this.data.hasSelectedPackList
          }
        ];
        this.setAddedValued(this.data.list[i].oneCode,packListValue);
        for(let j=0;j<this.data.hasSelectedPackList.length;j++){
          addedValuedStr.push(`${this.data.hasSelectedPackList[j].serviceName}x${this.data.hasSelectedPackList[j].serviceNum} ¥${this.data.hasSelectedPackList[j].serviceCharge}*${this.data.hasSelectedPackList[j].serviceNum}`);
        }
      }
      if(this.data.list[i].oneCode == 'SR' && this.data.hasSelectedCashBackList.length>0){
        cashBackList = [
          {
            serviceCharge:this.data.cashBackTotal,
            serviceName:this.data.list[i].oneName,
            serviceCode:'SR',
            details:this.data.hasSelectedCashBackList
          }
        ];
        for(let j=0;j<this.data.hasSelectedCashBackList.length;j++){
          let signType = 'params.signType';
          prevPage.setData({
            [signType]:this.data.hasSelectedCashBackList[j].twoCode == 'ESR'?'1':'2'
          });
        } 
        this.setAddedValued(this.data.list[i].oneCode,cashBackList);
      }
    }
    let orderServiceDetailVo = 'params.orderServiceDetailVo';
    let addedInsuredList = this.data.addedInsuredList;
    prevPage.setData({
      addedValuedDesc:this.data.addedValuedDesc,
      [orderServiceDetailVo]:addedInsuredList.length==0?[...packListValue,...cashBackList]:[...packListValue,...cashBackList,addedInsuredList],
      addedValuedDesc: addedValuedStr.length>0? addedValuedStr.join(' | '):'',
    });
    prevPage.onCalculate();
    wx.navigateBack();
  },
  // 设置增值服务
  setAddedValued(code,list){
    if(this.data.initList.length == 0) return;
    let arr = this.data.initList.filter(item=>{
      return item.serviceCode == code;
    })
    if(arr.length == 0){
      this.data.initList.push(list[0]);
    }else{
      for(let i=0;i<this.data.initList.length;i++){
        if(this.data.initList[i].serviceCode==code){
          this.data.initList[i] = list[0];
        }
      }
    }
    this.setData({
      initList:this.data.initList
    });
  },
  // 关闭增值服务明细
  closeaddeddetail(e){
    let flag = e.detail.params;
    this.setData({
      showAddedDetail:flag
    }) 
  },
  showaddeddetail(e){
    this.setData({
      showAddedDetail:true
    })
  },
  // 关闭包装弹窗
  closePack(e){
    let flag = e.detail.params;
    this.setData({
      showPack:flag
     });
  },
  // 获取pack数据
  getPack(e){
    let packList = e.detail.params;
    let addedValuedStr = [],hasSelectedPackList=[];
    for(let key in packList){
      hasSelectedPackList.push(packList[key]);
      addedValuedStr.push(`${packList[key].serviceName}x${packList[key].serviceNum} ¥${packList[key].serviceCharge}*${packList[key].serviceNum}`);
    }
    this.setData({
      showPack:false,
      hasSelectedPackList:hasSelectedPackList,
      addedValuedDesc:addedValuedStr.join(' | ')
    });
    this.getCalculate();
  },
  // 关闭签单返还弹窗 closecashback 
  closeCashBack(e){
    let flag = e.detail.params;
    this.setData({
      showCashBack:flag
     });
  },
  // 获取签单返还数据
  getCashPack(e){
    let cashBackObj = e.detail.params;
    let pages = getCurrentPages();
    //获取上一个页面
    let prevPage = pages[pages.length - 2];
    let offlineSignRemark = 'params.offlineSignRemark';
    prevPage.setData({
      [offlineSignRemark]:cashBackObj.remark
    });
    this.setData({
      showCashBack:false,
      hasSelectedCashBackList:[cashBackObj],
     });
     this.getCalculate();
  },
  showDia(e){
    let index = e.currentTarget.dataset.index;
    let item = this.data.list[index];
    if(item.oneCode == 'PK' && this.data.selectList.includes(item.oneCode)){
      this.setData({
        showPack:true,
        addedPackList:item.children
      });
    }else if(item.oneCode == 'SR' && this.data.selectList.includes(item.oneCode)){
      this.setData({
      showCashBack:true,
      addedCashBackList:item.children
      });
    }
  },
  showAddVaule(e){
    let index = e.currentTarget.dataset.index;
    let item = this.data.list[index];
    if(this.data.selectList.includes(item.oneCode)){
      this.data.selectList.splice(this.data.selectList.indexOf(item.oneCode),1);
    }else{
      this.data.selectList.push(item.oneCode);
    }
    this.setData({
      selectList:this.data.selectList
    });
    if(item.oneCode == 'PK'){
      if(this.data.selectList.includes(item.oneCode)){
        this.setData({
          showPack:true,
          addedPackList:item.children
        });
      }else{
        this.removeList(item.oneCode);
        this.setData({
          hasSelectedPackList:[],
          packTotal:0,
          allTotal:Subtr(this.data.allTotal,this.data.packTotal),
        });
      }
    }else if(item.oneCode == 'SR'){
      if(this.data.selectList.includes(item.oneCode)){
        this.setData({
          showCashBack:true,
          addedCashBackList:item.children
         });
      }else{
        this.removeList(item.oneCode);
        this.setData({
          hasSelectedCashBackList:[],
          cashBackTotal:0,
          allTotal:Subtr(this.data.allTotal,this.data.cashBackTotal),
        });
      }
    }
  },
  removeList(code){
    let list = this.data.initList;
    for(let i=0;i<list.length;i++){
      if(list[i].serviceCode == code){
        this.data.initList.splice(i,1);
      }
    }
    if(code == 'SR'){
      this.setData({
        hasSelectedCashBackList:[]
      });
    }else{
      this.setData({
        hasSelectedPackList:[]
      });
    }
    this.setData({
      initList:this.data.initList
    });
  }
})
