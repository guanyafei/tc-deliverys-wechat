let {checkIsNull,debounce} = require('../../utils/util');
let {getGoodsNameList,getChackContraband} = require('../../http/index.js');
Page({
  data: {
    errMsg:'',
    sortList:[],
    defaultList:[],
    params:{
      goodName:''
    }
  },
  onLoad: function (options) {
    let params = options.name;
    let goodName= 'params.goodName';
    this.setData({
      [goodName]:params
    });
    getGoodsNameList({
      goodName:''
    }).then(res=>{
      if(res.code == 200){
        this.setData({
          defaultList:res.data
        });
      }
    });
  },
  // 查询
  onSearchItem(e){
    let val = e.detail.value;
    let params= 'params.goodName';
    this.setData({
      [params]:val
    });
    if(checkIsNull(val)){
      return;
    }
    this.getList();
  },
  getList(){
    debounce(()=>{
      getGoodsNameList(this.data.params).then(res=>{
        if(res.code == 200){
          this.setData({
            defaultList:[],
            sortList:res.data
          });
        }
      });
    })();
  },
  // 物品分类点击
  onSelectSort(e){
    let index = e.currentTarget.dataset.index;
    let item = this.data.defaultList.length>0?this.data.defaultList[index]:this.data.sortList[index];
     let params= 'params.goodName';
    this.setData({
      [params]:item.goodsName
    });
    this.onCheckContraband({goodName:item.goodsName});
  },
  // 保存
  save(){
    if(checkIsNull(this.data.params.goodName)){
      wx.showToast({
        title: '请输入物品名称！',
        icon: 'none',
        duration: 3000
      });
      return
    }
    this.onCheckContraband({goodName:this.data.params.goodName});
  },
  // 校验是否是违禁品
  onCheckContraband(params){
    getChackContraband(params).then(res=>{
      if(res.code == 200 && res.data){
        wx.showToast({
          title: '物品为国家规定违禁品名录内物品，不可邮寄！',
          icon:'none',
          duration:3000
        })
      }else{
        let pages = getCurrentPages();
        //获取上一个页面
        let prevPage = pages[pages.length - 2]; 
        prevPage.setData({
          goodsName: this.data.params.goodName
        });
        prevPage.onBtnIsActive();
        wx.navigateBack();
      }
   });
  },
  // 跳转相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    if(page == 'contraband'){
      wx.navigateTo({
        url: "/pages/contraband/index",
      })
    }
  }
})