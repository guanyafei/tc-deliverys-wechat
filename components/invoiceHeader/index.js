let {getListInvoice,getDeleteInvoice,setDefaultInvoice} = require('../../http/index.js');
Component({
  /**
   * 组件的初始数据
   */
  data: {
     //  type 1:企业  2:个人/非企业
    list:[]
  },
  lifetimes:{
      attached: function() {
        this.getList();
      },
  },
  pageLifetimes:{
    show: function() {
      // 页面被展示
      this.getList();
    }
  },
  properties:{
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取list 
    getList(searchValue=''){
      let userInfo = wx.getStorageSync('userInfo'); 
      let params={
        user_name:userInfo.userName,
        search_value:searchValue,
        authentication_type: '',
        rise_type: '',
      };
      getListInvoice(params).then(res=>{
        if(res.code == 200){
          this.setData({
            list:res.data || []
          })
        }
      });
    },
    // 跳转相应页面
    goPage(e){
      let page =  e.currentTarget.dataset.page;
      let id =  e.currentTarget.dataset.id;
      if(page == 'invoiceHeaderDetail'){
        wx.navigateTo({
          url: '/pagesC/invoiceHeaderDetail/index?id='+id,
        })
      }else if(page == 'invoiceHeader'){
        wx.navigateTo({
          url: '/pagesC/invoiceHeader/index?page=edit&id='+id,
        })
      }
    },
  // 设置默认抬头
  setDefault(e){
    let id = e.currentTarget.dataset.id,userInfo = wx.getStorageSync('userInfo'); 
    let params = {
      id:id,
      userName:userInfo.userName
    }
    setDefaultInvoice(params).then(res=>{
       if(res.code==200){
        this.getList();
       }
    });
  },
  // 删除抬头
  del(e){
    let id = e.currentTarget.dataset.id,isDefault=e.currentTarget.dataset.isdefault;
    if(isDefault == '1'){
      wx.showToast({
        title: '不允许删除默认抬头！',
        icon: 'none',
        duration: 2000
      })
       return;
    }
    wx.showModal({
      title: '系统提示',
      content: '是否删除当前抬头信息？',
      confirmText:'确定',
      confirmColor:'#466FED',
      cancelColor:'#2F2F2F',
      success:(res)=>{
        if (res.confirm) {
          getDeleteInvoice(id).then(res=>{
            if(res.code == 200){
              this.getList();
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  }
})

