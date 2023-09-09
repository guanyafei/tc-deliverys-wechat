let {getWaybillList,getQueryCount,getCancelOrder,getToCollect} = require('../../http/index.js');
let {formatFilterTime,checkIsNull } = require('../../utils/util');
Page({
  data: {
    index:1,
    dropIndex:0,
    timer:null,
    sendStatus:[{
      key:'全部',
      value:''
    },{
      key:'待揽收',
      value:'3'
    },{
      key:'已揽收',
      value:'5'
    },{
      key:'运输中',
      value:'6'
    },{ 
      key:'已签收',
      value:'9'
    },{
      key:'拦截单',
      value:'YC' 
    },{
      key:'拒签',
      value:'8'
    }],
    sendIndex:0,
    acceptStatus:[{
      key:'全部',
      value:''
    },{
      key:'回单',
      value:'HD'
    },{
      key:'拒签返回',
      value:'8'
    },{
      key:'运输中',
      value:'6'
    },{
      key:'已签收',
      value:'9'
    },{
      key:'拒签',
      value:'8'
    }],
    acceptIndex:0,
    payStatus:[{
      key:'全部',
      value:'all'
    },{
      key:'未支付',
      value:'1'
    },{
      key:'支付失败',
      value:'3'
    }],
    payIndex:0,
    notifyToast:false,
    list:[],
    notifyFlag:false, //揽收按钮
    notifyIdList:[],
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
    total:0,
    loadMore:true,
    sendTotal:0,
    acceptTotal:0,
    payTotal:0,
    filterStatus:'',
    detailRetFlag:false
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
    if(this.data.detailRetFlag)return
    let userInfo = wx.getStorageSync('userInfo');
    let consignorCustomerAccount = 'params.consignorCustomerAccount';
    this.setData({
      [consignorCustomerAccount]: userInfo.userName,
    });
    this.getList();
    getQueryCount({
      consigneeCustomerAccount: userInfo.userName,
      consignorCustomerAccount: userInfo.userName,
      // consigneeContactPhone:userInfo.phonenumber,
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
      detailRetFlag:true
    });
    
    if (!this.data.loadMore) return;
    getWaybillList(this.data.params).then(res => {
      if (res.code == 200) {
        let list = []; 
        if(this.data.index == 2 && this.data.acceptIndex == 2){
          let arr = this.onSetFilter(res.rows);
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
          if(this.data.acceptIndex == 2){
            this.setData({
              acceptTotal:this.data.list.length
            });
          }else{
            this.setData({
              acceptTotal:res.total || 0
            });
          }
        }else if(this.data.index == 3){
          this.setData({
            payTotal:res.total || 0
          });
        }
      }
    });
  },
  // 拒签返还筛选
  onSetFilter(list){
    let arr = [];
    for(let i=0;i<list.length;i++){
      if(list[i].orderType == '2'){
        arr.push(list[i]);
      }
    }
    return arr;
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
  // 是否展示催收按钮
  onIsShowNotify(e) {
    let list = e.detail.params;
    if (list.length > 1) {
      this.setData({
        notifyFlag: true,
        notifyIdList: list
      })
    } else {
      this.setData({
        notifyFlag: false,
        notifyIdList: []
      })
    }
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
      dropIndex: 0,
      total: 0,
      loadMore: true,
      list: [],
      sendIndex: 0,
      acceptIndex: 0,
      payIndex: 0,
      [pageNum]: 1,
      [pageSize]: 20,
      sendIndex: 0,
      acceptIndex: 0,
      payIndex: 0,
      filterStatus:'',
      notifyFlag:false,
      notifyIdList: []
    });
    if(!checkIsNull(this.data.params.transferNo)){
      this.setData({
        [consigneeContactPhone]:''
      });
    }
    this.getList();
  },
  // 详情页点击回单号返回运单追踪页
  onDetailToQuery(){
    let params = {
      currentTarget:{
        dataset:{
          index:2
        }
      }
    }
    this.setData({
      detailRetFlag:true
    })
    this.selected(params);
  },
  // 下拉展示
  dropDown(e) {
    let index = e.currentTarget.dataset.index;
    if(this.data.dropIndex==index){
      this.setData({
        dropIndex: -1,
        index: index
      });
    }else{
      this.setData({
        dropIndex: index,
        index: index
      });
    }
    this.setData({
      notifyFlag:false,
      notifyIdList: []
    })
  },
  // 下拉状态筛选
  selectStatus(e) {
    let index = e.currentTarget.dataset.index;
    let mod = e.currentTarget.dataset.mod;
    let value = e.currentTarget.dataset.value;
    let userInfo = wx.getStorageSync('userInfo');
    let consignorCustomerAccount = 'params.consignorCustomerAccount';
    let consigneeCustomerAccount = 'params.consigneeCustomerAccount';
    let consigneeContactPhone = 'params.consigneeContactPhone';
    let zfStatus = "params.zfStatus";
    let status = "params.status";
    let pageNum = 'params.pageNum';
    let pageSize = 'params.pageSize';
    if (mod == 'send') {
      let status = 'params.status';
      this.setData({
        sendIndex: index,
        acceptIndex: 0,
        payIndex: 0,
        [status]: value,
        [zfStatus]: '',
        [consignorCustomerAccount]: userInfo.userName,
        [consigneeCustomerAccount]: '', 
        [consigneeContactPhone]:'',
      })
    } else if (mod == 'accept') {
      let status = 'params.status';
      this.setData({
        sendIndex: 0,
        acceptIndex: index,
        payIndex: 0,
        [status]: value,
        [zfStatus]: '',
        [consignorCustomerAccount]: '',
        [consigneeCustomerAccount]: userInfo.userName,
        [consigneeContactPhone]:userInfo.phonenumber,
      })
    } else if (mod == 'pay') {
      let zfStatus = 'params.zfStatus';
      this.setData({
        sendIndex: 0,
        acceptIndex: 0,
        payIndex: index,
        [status]: '',
        [zfStatus]: value,
        [consignorCustomerAccount]: userInfo.userName,
        [consigneeCustomerAccount]: userInfo.userName,
        [consigneeContactPhone]:'',
      })
    };
    this.setData({
      dropIndex:0,
      total:0,
      loadMore:true,
      list:[],
      [pageNum]:1,
      [pageSize]:20,
      filterStatus:value,
      notifyFlag:false,
      notifyIdList: []
    });
    if(!checkIsNull(this.data.params.transferNo)){
      this.setData({
        [consigneeContactPhone]:''
      });
    }
    this.getList();
  },
  // 催收
  notify() {
    wx.showModal({
      title: '系统提示',
      content: '是否向揽收员发送催揽消息？',
      confirmText: '确定',
      confirmColor: '#466FED',
      cancelColor: '#2F2F2F',
      success: (res) => {
        if (res.confirm) {
          getToCollect(this.data.notifyIdList).then(res=>{
            if(res.code == 200){ 
              this.setData({
                notifyToast: true
              });
              let timer = setTimeout(() => {
                clearTimeout(timer);
                this.setData({
                  notifyToast: false
                });
              }, 3000);
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onReachBottom() {
    this.getList()
  }
})