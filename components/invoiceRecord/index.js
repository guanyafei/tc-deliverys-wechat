let {getInvoiceRecord} = require('../../http/index.js');
Component({
  data: {
    list:[],
    selectIndex:-1,
    pageSize:20,
    pageNum:1,
    total:0,
    loadMore:true,
  },
  lifetimes:{
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.getList();
    },
  },
  properties:{
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getSearchList(searchKey){
      let params = {
        pageSize:20,
        pageNum:1,
        deliveryNo:searchKey
      };
      this.setData({
        pageSize:20,
        pageNum:1,
        total:0,
        loadMore:true,
        list:[],
      });
      this.getInterfaceList(params);
    },
    // 获取列表
    getList(searchValue=''){ 
      let params = {
        pageSize:this.data.pageSize,
        pageNum:this.data.pageNum
      }
      if(!this.data.loadMore) return;
      this.getInterfaceList(params);
    },
    // 发请求
    getInterfaceList(data){
      getInvoiceRecord(data).then(res=>{
        if(res.code == 200){ 
          let tempList = [];
          this.data.list.length>0?(this.data.list.push(...res.rows),tempList=this.data.list):tempList=res.rows;
          this.setData({
            list:tempList,
            total:res.total || 0,
            loadMore:this.data.list.length<res.total?true:false,
            pageNum:res.rows.length==this.data.pageSize?++this.data.pageNum:this.data.pageNum,
          });
        }
      });
    },
    // 下载
    downLoad(e){
      let index = e.currentTarget.dataset.index;
      let invoiceItem = this.data.list[index];
      let fileName = new Date().valueOf();
      let filePath = wx.env.USER_DATA_PATH + '/' + fileName + '.jpg'
      wx.showLoading({
        title: '下载中',
      })
      wx.downloadFile({
        url: 'https:'+invoiceItem.downloadUrl,
        filePath: filePath,
        success: res => {
          if (res.statusCode == 200){
             wx.saveImageToPhotosAlbum({
               filePath: filePath,
               success:function(){
                wx.hideLoading();
                wx.showToast({
                  title: '文件已保存到您的手机相册',
                  icon:'none',
                  duration: 3000
                })
               }
             })
          }
        },
        fail:function(err){
          wx.hideLoading();
          if(err.errMsg  === 'saveImageToPhotosAlbum:fail auth deny'){
            wx.openSetting({
              success(setting){
                if(setting.authSetting['scope.writePhotosAlbum']){
                  wx.showToast({
                    title: '请再次点击下载',
                    icon:'none',
                    duration: 3000
                  });
                }
              }
            })
          }
        }
      })
    },
    // 更多 选中
    selectItem(e){
      let index = e.currentTarget.dataset.index;
      this.setData({
        selectIndex:index
      })
    },
    // 跳转相应页面
    goPage(e){
      let page = e.currentTarget.dataset.page;
      if(page == 'invoiceDetail'){
        // 已开发票详情
        let index = e.currentTarget.dataset.index;
        let invoiceItem = this.data.list[index];
        wx.navigateTo({
          url: `/pagesC/invoiceDetail/index?invoiceItem=${JSON.stringify(invoiceItem)}`,
        })
      }else if(page == 'invoiceApply'){
        let index = e.currentTarget.dataset.index;
        let invoiceItem = this.data.list[index];
        let status = e.currentTarget.dataset.status;
        let invoiceDeliveryNoList = invoiceItem.deliveryNos;
        let orderNoList = invoiceItem.orderNos;
        let totalPrice = invoiceItem.invoiceAmount;
        wx.navigateTo({
          url: `/pagesC/invoiceApply/index?invoiceItem=${JSON.stringify(invoiceItem)}&status=${status}&invoiceDeliveryNoList=${invoiceDeliveryNoList}&orderNoList=${orderNoList}&totalPrice=${totalPrice}`,
        })
      }else if(page == 'invoiceImg'){
        let index = e.currentTarget.dataset.index;
        let invoiceItem = this.data.list[index];
        wx.navigateTo({
          url: `/pagesC/invoiceImg/index?invoiceImg=${invoiceItem.downloadUrl}`,
        })
      }
    },
  }
})

