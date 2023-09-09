Page({
  data: {
    sendIndex:-1,
    index:1,
    dropIndex:0,
    sendStatus:['近一个月','近三个月','近半年','近一年'],
    invoiceIdList:[],
    invoiceList:[],
    invoiceDeliveryNoList:[],
    selectAllFlag:false,
    totalPrice:0,
    searchPlaceholder:'请输入运单号',
    searchKey:'',
    sendTip:'近一年'
  },
  onLoad() {
 
  },
  // 查询
  onSearch(e){
    let searchKey = e.detail.value;
    const interval={
      '0':1,
      '1':3,
      '2':6,
      '3':12,
      '-1':0
    };
    this.setData({
      searchKey:searchKey
    });
    if(this.data.index == 1) this.selectComponent('#invoiceItem').getSearchList(interval[this.data.sendIndex],searchKey);
    if(this.data.index == 2) this.selectComponent('#invoiceRecord').getSearchList(searchKey);
    if(this.data.index == 3) this.selectComponent('#invoiceHeader').getList(searchKey);
  },
  // 获取待开票list
  setAwaitInvoiceBillList(e){
    let list = e.detail.list,totalPrice=e.detail.totalPrice;

    this.setData({
      invoiceList:list,
      totalPrice:totalPrice
    })
  },
  // 全选
  onSelectAll(e){
    if(this.data.invoiceList.length==0)return;
    this.setData({
      selectAllFlag:!this.data.selectAllFlag
    });
    this.selectComponent('#invoiceItem').onCompSelectAll(this.data.selectAllFlag);
  },
  // 设置获取id
  onSetInvoiceIdList(e){
    let ids=e.detail.ids,totalPrice=e.detail.totalPrice,invoiceDeliveryNoList=e.detail.invoiceDeliveryNoList;
    this.setData({
      selectAllFlag: this.data.invoiceList.length !=0 && ids.length==this.data.invoiceList.length,
      invoiceIdList:ids,
      totalPrice:totalPrice,
      invoiceDeliveryNoList:invoiceDeliveryNoList
    })
  },
  // 扫描
  onScanCode(e){
    wx.scanCode({
      onlyFromCamera:false,
      scanType:['barCode'],
      success:(res)=>{
        let result = res.result;
      }
    })
  },
  // 跳转相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    if(page == 'invoiceHeader'){
      wx.navigateTo({
        url: '/pagesC/invoiceHeader/index?page=add',
      })
    }else if(page == 'invoiceApply'){
      if(this.data.invoiceIdList.length == 0) return;
      wx.navigateTo({
        url: `/pagesC/invoiceApply/index?totalPrice=${this.data.totalPrice}&orderNoList=${this.data.invoiceIdList}&invoiceDeliveryNoList=${this.data.invoiceDeliveryNoList}`,
      })
    }
  },
  // 状态筛选
  selected(e){
    let index = e.currentTarget.dataset.index;
    let placeholder = '';
    if(index == 1 || index == 2) placeholder = '请输入运单号';
    if(index == 3) placeholder = '请输入公司名称/纳税人识别号';
    this.setData({
      index:index,
      dropIndex:0,
      sendIndex:-1,
      searchPlaceholder:placeholder
    })
  },
  // 下拉展示
  dropDown(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      dropIndex:index,
      index:index
    })
  },
  // 下拉状态筛选
  selectStatus(e){
    let index = e.currentTarget.dataset.index;
    let mod =  e.currentTarget.dataset.mod;
    if(mod=='send'){
      const interval={
        '0':1,
        '1':3,
        '2':6,
        '3':12,
        '-1':0
      };
      this.setData({
      sendIndex:index,
      });
      this.selectComponent('#invoiceItem').reSet();
      this.selectComponent('#invoiceItem').getList(interval[index]);
    }
    this.setData({
      dropIndex:0,
      sendTip:this.data.sendStatus[index]
    })
  },
  onReachBottom(){
    if(this.data.index == 1){
      const interval={
        '0':1,
        '1':3,
        '2':6,
        '3':12,
        '-1':0
      }
      this.selectComponent('#invoiceItem').getList(interval[this.data.sendIndex],this.data.searchKey);
    }else if(this.data.index == 2){
      this.selectComponent('#invoiceRecord').getList(this.data.searchKey)
    }
    // else if(this.data.index == 3){
    //   this.selectComponent('#invoiceHeader').getList(this.data.searchKey);
    // }
  }
})
