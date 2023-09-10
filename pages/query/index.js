let {getWaybillList,getQueryCount,getCancelOrder,getToCollect} = require('../../http/index.js');
let {formatFilterTime,checkIsNull } = require('../../utils/util');
Page({
  data: {
    total:0,
    loadMore:true,
    sendTotal:10,
    acceptTotal:3,
    payTotal:0,
    index:1, 
    timer:null,
    list:[],
    params:{
      pageNum:1,
      pageSize:20,
      processFlag:0,
      status:'',
      zfStatus:'',
      consignorCustomerAccount:'',
      consigneeCustomerAccount:'',
      consigneeContactPhone:'',
      queryBeginTime:'',
      queryEndTime:'',
      transferNo:''
    },
  },
  onLoad() {
  },
  onShow() {
    if(checkIsNull(wx.getStorageSync('token'))){
      wx.showModal({
        title: '登录提示',
        content: '当前操作需要您进行登录',
        confirmText:'确定',
        confirmColor:'#417CF7',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            // wx.navigateTo({
            //   url: '/pagesB/login/index' 
            // }) 
          } else if (res.cancel) {
            wx.switchTab({
              url: '/pages/home/index'
            })
          }
        }
      });
      return;
    }
    let userInfo = wx.getStorageSync('userInfo');
    let consignorCustomerAccount = 'params.consignorCustomerAccount';
    this.setData({
      [consignorCustomerAccount]: userInfo.userName,
    });
    this.getList();
    getQueryCount({
      consigneeCustomerAccount: userInfo.userName,
      consignorCustomerAccount: userInfo.userName,
      paymentStatus: 'all',
      status: '',
      queryBeginTime: formatFilterTime(12), 
      queryEndTime: formatFilterTime(0)
    }).then(res => {
      if (res.code == 200) {
        this.setData({
          sendTotal: res.data[0] || 0,
          acceptTotal: res.data[1] || 0,
          payTotal: res.data[2] || 0,
        });
      }
    });
  },
  // 查询
  gotSearch(e){
    let searchKey = e.detail.value;
    let transferNo = 'params.transferNo';
    let pageNum = 'params.pageNum';
    let pageSize = 'params.pageSize';
    this.setData({
      [transferNo]:searchKey,
      total:0,
      loadMore:true,
      list:[],
      [pageNum]:1,
      [pageSize]:20,
    });
    if(this.data.index==2 && !checkIsNull(this.data.params.transferNo)){
      let consigneeContactPhone = 'params.consigneeContactPhone';
      this.setData({
        [consigneeContactPhone]:''
      });
    }
    this.getList();
  },
  onInputSearch(e){
    let searchKey = e.detail.value;
    let transferNo = 'params.transferNo';
    this.setData({
      [transferNo]:searchKey,
    });
  },
  // 取消运单
  onCancelOrder(e){
    let params = {
      orderNos:e.detail.params,
      cancelReason:'取消订单'
    }
    getCancelOrder(params).then(res=>{
      if(res.code == 200 || res.code == 201){
        let transferNo = 'params.transferNo';
        let pageNum = 'params.pageNum';
        let pageSize = 'params.pageSize';
        wx.showToast({
          title: res.code == 200?'订单取消成功':res.msg,
          icon:'none',
          duration: 2000
        });
        if(this.data.timer) clearTimeout(this.data.timer);
        this.data.timer = setTimeout(()=>{
          clearTimeout(this.data.timer);
          this.setData({
            [transferNo]:this.data.params.transferNo,
            total:0,
            loadMore:true,
            list:[],
            [pageNum]:1,
            [pageSize]:20,
          });
          this.getList();
        },1000);
      }
    });
  },
  // 获取列表
  getList() {
    let queryBeginTime = 'params.queryBeginTime';
    let queryEndTime = 'params.queryEndTime';
    this.setData({
      [queryBeginTime]: formatFilterTime(12),
      [queryEndTime]: formatFilterTime(0),
    });
    
    if (!this.data.loadMore) return;
    this.setData({
        list: [
            {
                status: 1,
                orderNo: 2,
                waybillNo: 3,
                serviceProduct: 4,
                consignor: '张三',
                consignee: '李四',
                sumPrice: '100',
            },
            {
                status: 1,
                orderNo: 2,
                waybillNo: 3,
                serviceProduct: 4,
                consignor: '张三',
                consignee: '李四',
                sumPrice: '100',
            }
        ],
    });
    getWaybillList(this.data.params).then(res => {
      if (res.code == 200) {
        let list = []; 
        if(this.data.index == 2){
          list = this.data.list.concat(arr);
        }else{
          list = this.data.list.concat(res.rows);
        }
        this.setData({
          list: list,
          total: res.total || 0,
          loadMore: res.total == list.length ? false : true,
          pageNum: res.rows.length == this.data.params.pageSize ? ++this.data.params.pageNum : this.data.params.pageNum
        });
        if(this.data.index == 1){
          this.setData({
            sendTotal:res.total || 0
          });
        }else if(this.data.index == 2){
            this.setData({
                acceptTotal:res.total || 0
            });
        }else if(this.data.index == 3){
          this.setData({
            payTotal:res.total || 0
          });
        }
      }
    });
  },
  // 扫描
  onScanCode(e) {
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['barCode'],
      success: (res) => {
        let result = res.result;
      }
    })
  },
  // 状态筛选
  selected(e) {
    let index = e.currentTarget.dataset.index;
    let userInfo = wx.getStorageSync('userInfo');
    let consignorCustomerAccount = 'params.consignorCustomerAccount';
    let consigneeCustomerAccount = 'params.consigneeCustomerAccount';
    let consigneeContactPhone = 'params.consigneeContactPhone';
    let zfStatus = "params.zfStatus";
    let status = "params.status";
    let pageNum = 'params.pageNum';
    let pageSize = 'params.pageSize';
    if (index == '1') {
      this.setData({
        [consignorCustomerAccount]: userInfo.userName,
        [consigneeCustomerAccount]: '',
        [consigneeContactPhone]:'',
        [zfStatus]: '',
        [status]: ''
      });
    } else if (index == '2') {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        [consigneeCustomerAccount]: userInfo.userName,
        [consignorCustomerAccount]: '',
        [consigneeContactPhone]:userInfo.phonenumber,
        [zfStatus]: '',
        [status]: '',

      });
    } else if (index == '3') {  
      this.setData({
        [zfStatus]: 'all',
        [consignorCustomerAccount]: userInfo.userName,
        [consigneeCustomerAccount]: userInfo.userName,
        [consigneeContactPhone]:'',
        [status]: ''
      });
    }
    this.setData({
      index: index,
      total: 0,
      loadMore: true,
      list: [],
      [pageNum]: 1,
      [pageSize]: 20,
    });
    if(!checkIsNull(this.data.params.transferNo)){
      this.setData({
        [consigneeContactPhone]:''
      });
    }
    this.getList();
  },
  onReachBottom() {
    this.getList()
  }
})