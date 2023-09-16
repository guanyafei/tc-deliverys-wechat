let {getBookList,getDelBook,getEditBook,setDefaultAddress} = require('../../http/index.js');
Page({
  data: {
    index: 1,
    timer:null,
    list:[],
    ids:[],
    manageFlag:false,
    delFlag:false,
    total:0,
    loadMore:true,
    sign_status:'0',//0:未签约 1：已签约
    params:{
      user_name:'',
      pageSize:20,
      pageNum:1,
      search_name:'',
      address_type:''
    }
  },
  onLoad(option) {
    let address_type = 'params.address_type';
    this.setData({
      [address_type]:option.addressType || ''
    })
  },
  onShow(){
    let userInfo = wx.getStorageSync('userInfo');
    let user_name = 'params.user_name';
    let page_size = 'params.pageSize';
    let page_num = 'params.pageNum';
    this.setData({
      [user_name]:userInfo.userName,
      sign_status:userInfo.consumerSignStatus,
      list:[],
      [page_size]:20,
      [page_num]:1,
      loadMore:true,
      total:0,
    });
    this.getList();
  },
  selected(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
        index: index,
    });
  },
  // 查询
  gotSearch(e){
    let searchKey =  e.detail.value;
    let search_name = 'params.search_name';
    this.setData({
      [search_name]:searchKey
    });
    this.setData({
      total:0,
      loadMore:true,
      list:[]
    })
    this.getList();
  },
  // 获取地址列表
  getList(){
    if (!this.data.loadMore) return;
    getBookList(this.data.params).then(res=>{
      if(res.code == 200){
        if(res.code == 200){
          let list = this.data.list.concat(res.data.rows);
          let pageNum = "params.pageNum";
          this.setData({
            list:list,
            total:res.data.total || 0,
            loadMore:res.data.total == list.length ? false : true,
            [pageNum]:res.data.rows.length==this.data.params.pageSize?++this.data.params.pageNum:this.data.params.pageNum,
          });
        }
      }
    });
  },
  // 删除
  onDel(e){
    let id = e.currentTarget.dataset.id;
    let params = [id];
    let _this = this;
    this.onFinished();
    wx.showModal({
      title: '系统提示',
      content: '是否删除当前联系人信息？',
      confirmText:'确定',
      confirmColor:'#417CF7',
      cancelColor: '#2F2F2F',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          getDelBook(params).then(res=>{
            if(res.code == 200){
              wx.showToast({
                title: '删除成功',
                icon:'none',
                duration: 2000
              });
              if(_this.data.timer) clearTimeout(_this.data.timer);
              _this.data.timer = setTimeout(()=>{
                clearTimeout(_this.data.timer);
                _this.setData({
                  total:0,
                  loadMore:true,
                  list:[]
                });
                _this.getList();
              },100);
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 批量删除
  onBatchDel(){
    if(this.data.ids.length==0) return;
    let _this = this;
    wx.showModal({
      title: '系统提示',
      content: '是否删除当前联系人信息？',
      confirmText:'确定',
      confirmColor:'#417CF7',
      cancelColor: '#2F2F2F',
      success (res) {
        if (res.confirm) {
          getDelBook(_this.data.ids).then(res=>{
            if(res.code == 200){
              wx.showToast({
                title: '删除成功',
                icon:'none',
                duration: 2000
              });
              if(_this.data.timer) clearTimeout(_this.data.timer);
              _this.data.timer = setTimeout(()=>{
                clearTimeout(_this.data.timer)
                _this.setData({
                  total:0,
                  loadMore:true,
                  list:[],
                  ids:[],
                  manageFlag:false,
                  delFlag:false,
                });
                _this.getList();
              },100); 
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 设置默认地址
  onSetDefault(e){
   let index = e.currentTarget.dataset.index;
   let item  = this.data.list[index];
   let userInfo = wx.getStorageSync('userInfo');
   let params = {
      id:item.id,
      userName:userInfo.userName
    };
    this.onFinished();
    setDefaultAddress(params).then(res=>{
      if(res.code = 200){
        this.setData({
          total:0,
          loadMore:true,
          list:[],
          ids:[],
          manageFlag:false,
          delFlag:false,
        });
        this.getList();
      }
    });
  },
  // 完成
  onFinished(){
    this.setData({
      manageFlag:false,
      delFlag:false,
      ids:[]
    })
  },
  // 管理
  onManage(){
    if(this.data.list.length == 0){
      return
    }
    this.setData({
      manageFlag:true,
      delFlag:true
    })
  },
  // 选中删除项
  selectItem(e){
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
      if(this.data.ids.includes(id)){
        this.data.ids.splice(this.data.ids.indexOf(id),1);
        this.data.list[index]['isSelected'] = 1;
      }else{
        this.data.ids.push(id);
        this.data.list[index]['isSelected'] = 2;
      }
      this.setData({
        list:this.data.list,
        ids:this.data.ids
      });
  },
  // 跳转相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    // let index =  e.currentTarget.dataset.index;
    // let item = this.data.list[index];
    // let params = {
    // book_province_name:item.bookProvinceName,
    // book_province:item.bookProvince,
    // book_city_name:item.bookCityName,
    // book_city:item.bookCity,
    // book_district_name:item.bookDistrictName,
    // book_district:item.bookDistrict,
    // book_street_name:item.bookStreetName,
    // book_street:item.bookStreet,
    // book_address:item.bookAddress,
    // address_type:item.addressType,
    // landline_number:item.landlineNumber,
    // phone:item.phone,
    // name:item.name,
    // id:item.id,
    // consumer_name:item.consumerName,
    // account_address_type:item.accountAddressType,
    // is_default:item.isDefault
    // }
    wx.navigateTo({
    url: `/pages/${page}/index?bookItem=${JSON.stringify({})}`,
    })
  },
  onReachBottom(){
    this.getList();
  }
})
