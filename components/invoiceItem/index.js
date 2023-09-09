let {getAwaitInvoiceBillList} = require('../../http/index.js');
let {formatFilterTime,accAdd,Subtr} = require('../../utils/util');
Component({
  /**
   * 组件的初始数据
   */
  data: {
    pageSize:20,
    pageNum:1,
    total:0,
    loadMore:true,
    list:[],
    invoiceIdList:[],
    invoiceDeliveryNoList:[],
    totalPrice:0,
  }, 
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.getList();
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      this.reSet()
    },
  },
  properties:{
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 重置
    reSet(){
      this.setData({
        pageSize:20,
        pageNum:1,
        total:0,
        loadMore:true,
        list:[],
      })
    },
    // 查询
    getSearchList(interval=0,searchKey){
      let params = {
        pageSize:20,
        pageNum:1,
        total:0,
        loadMore:true,
        list:[],
        deliveryNo:searchKey
      };
      if(interval==0){
        params.createTimeStart='';
        params.createTimeEnd='';
      }else{
        params.createTimeStart=formatFilterTime(interval);
        params.createTimeEnd=formatFilterTime(0);
      }
      this.reSet();
      this.getInterfaceList(params);
    },
    // 获取待开列表
    getList(interval=0){
      let params = {
        pageSize:this.data.pageSize,
        pageNum:this.data.pageNum
      }
      if(interval==0){
        params.createTimeStart='';
        params.createTimeEnd='';
      }else{
        params.createTimeStart=formatFilterTime(interval);
        params.createTimeEnd=formatFilterTime(0);
      }
      if(!this.data.loadMore) return;
      this.getInterfaceList(params);
    },
    // 发请求
    getInterfaceList(data){
      getAwaitInvoiceBillList(data).then(res=>{
        if(res.code == 200){
          let list = this.data.list.concat(res.rows); 
          this.setData({
            list:list,
            total:res.total || 0,
            loadMore:list.length<res.total?true:false,
            pageNum:res.rows.length==this.data.pageSize?++this.data.pageNum:this.data.pageNum,
          });
          this.triggerEvent('setAwaitInvoiceBillList',{list:this.data.list,totalPrice:this.data.totalPrice});
          this.triggerEvent('onSetInvoiceIdList',{ids:this.data.invoiceIdList,invoiceDeliveryNoList:this.data.invoiceDeliveryNoList});
        }
      });
    },
    // 单选invoiceDeliveryNoList
  selectItem(e){
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let isSelected = 'list['+index+'].isSelected';
    let deliveryNo = this.data.list[index].deliveryNo;
    let itemPrice = this.data.list[index].finalPrice;
      if(this.data.invoiceIdList.includes(id)){
        this.data.invoiceIdList.splice(this.data.invoiceIdList.indexOf(id),1);
        this.data.invoiceDeliveryNoList.splice(this.data.invoiceDeliveryNoList.indexOf(deliveryNo),1);
        this.setData({
          [isSelected]:1,
          totalPrice:Subtr(this.data.totalPrice,itemPrice),
          invoiceDeliveryNoList:this.data.invoiceDeliveryNoList
        });
      }else{
        let price = accAdd(this.data.totalPrice || 0,itemPrice || 0);
        if(price>1000) {
          price = Subtr(price,itemPrice);
          this.setData({
            [isSelected]:1
          });
        }else{
          this.data.invoiceIdList.push(id);
          this.data.invoiceDeliveryNoList.push(deliveryNo);
          this.setData({
            [isSelected]:2
          });
        }
        this.setData({
          totalPrice:price,
          invoiceDeliveryNoList:this.data.invoiceDeliveryNoList
        });
      }
      this.triggerEvent('onSetInvoiceIdList',{ids:this.data.invoiceIdList,totalPrice:this.data.totalPrice,invoiceDeliveryNoList:this.data.invoiceDeliveryNoList});
    },
    // 多选
    onCompSelectAll(flag){
      if(this.data.list.length == 0) return;
      let isSelected = null,id = '',price=0;
      for(let i=0;i<this.data.list.length;i++){
        isSelected = 'list['+i+'].isSelected';
        if(!flag){
          this.setData({
            [isSelected]:1,
          });
        }else{
          let deliveryNo = this.data.list[i].deliveryNo;
          id = this.data.list[i].orderNo;
          if(!this.data.invoiceIdList.includes(id)){
            let itemPrice = this.data.list[i].finalPrice;
            price = accAdd(this.data.totalPrice || 0,itemPrice || 0);
            if(price>1000) {
              price = Subtr(price,itemPrice);
              this.setData({
                [isSelected]:1,
              });
            }else{
              this.data.invoiceIdList.push(id);
              this.data.invoiceDeliveryNoList.push(deliveryNo);
              this.setData({
                [isSelected]:2,
              });
            }
            this.setData({
              totalPrice:price,
            });
          }
        }  
      }
      if(!flag){
        this.setData({
          invoiceIdList:[],
          invoiceDeliveryNoList:[],
          totalPrice:0
        });
      }else{
        this.setData({
          invoiceIdList:this.data.invoiceIdList,
          invoiceDeliveryNoList:this.data.invoiceDeliveryNoList
        });
      }
      this.triggerEvent('onSetInvoiceIdList',{ids:this.data.invoiceIdList,totalPrice:this.data.totalPrice,invoiceDeliveryNoList:this.data.invoiceDeliveryNoList});
    },
    // 跳转相应页面
    // goPage(e){
    //   let page =  e.currentTarget.dataset.page;
    //   if(page == 'invoiceApply'){
    //     wx.navigateTo({
    //       url: '/pagesC/invoiceApply/index',
    //     })
    //   }
    // },
  }
})

