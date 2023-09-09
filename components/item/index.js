let {getToCollect} = require('../../http/index.js');
Component({
  /**
   * 组件的初始数据
   */
  data: {
    copyToast: false,
    notifyToast: false,
    selectIndex: -1,
    notifyIdList: [],
    tempList:[]
  },
  properties: {
    list: {
      type: Array
    },
    itemIndex: {
      type: String
    },
    filterStatus: {
      type: String,
      value: 'none'
    }
  },
  observers: {
    'list': function (val) {
      this.setData({
        selectIndex: -1,
        notifyIdList:[],
        tempList:[...val]
      });
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 选中
    selectItem(e) {
      let id = e.currentTarget.dataset.id;
      let index = e.currentTarget.dataset.index;
      if (this.data.notifyIdList.includes(id)) {
        this.data.notifyIdList.splice(this.data.notifyIdList.indexOf(id), 1);
        this.data.tempList[index]['isSelected'] = 1;
      } else {
        this.data.notifyIdList.push(id);
        this.data.tempList[index]['isSelected'] = 2;
      }
      this.setData({
        tempList: this.data.tempList
      });
      this.triggerEvent('onIsShowNotify', {
        params: this.data.notifyIdList
      });
    },
    // 更多按钮
    onClickItem(e) {
      let index = e.currentTarget.dataset.index;
      if (this.data.selectIndex == index) {
        this.setData({
          selectIndex: -1
        })
      } else {
        this.setData({
          selectIndex: index
        })
      }
    },
    // 复制
    copyOrderNo(e) {
      let no = e.currentTarget.dataset.transferno;
      wx.setClipboardData({
        data: no,
        success: (res) => {
          wx.hideToast();
          wx.getClipboardData({
            success:()=> {
              wx.hideToast();
              this.setData({
                copyToast: true
              });
              let timer = setTimeout(() => {
                clearTimeout(timer);
                this.setData({
                  copyToast: false
                });
              }, 1000)
            }
          })
        },
        fail: (res) => {
          console.log("setClipboardData", res)
        }
      })
    },
    // 催收
    notify(e) {
      wx.showModal({
        title: '系统提示',
        content: '是否向揽收员发送催揽消息？',
        confirmText: '确定',
        confirmColor: '#466FED',
        cancelColor: '#2F2F2F',
        success: (res) => {
          if (res.confirm) {
            let id = e.currentTarget.dataset.id;
            getToCollect([id]).then(res=>{
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
    // 取消
    onCancle(e) {
      wx.showModal({
        title: '系统提示',
        content: '是否取消该运单？',
        confirmText: '确定',
        confirmColor: '#466FED',
        cancelColor: '#2F2F2F',
        success: (res) => {
          if (res.confirm) {
            let id = e.currentTarget.dataset.id;
            this.triggerEvent('onCancelOrder', {
              params: id
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    // 去支付页
    goPage(e) {
      let page = e.currentTarget.dataset.page;
      if (page == 'pay') {
        let index = e.currentTarget.dataset.index;
        let item = this.data.tempList[index];
        wx.navigateTo({
          url: `/pages/pay/index?orderNo=${item.orderNo}&orderTime=${item.orderTime}`,
        })
      } else if (page == 'detail') {
        let orderNo = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        let item = this.data.tempList[index];
        wx.navigateTo({
          url: '/pagesB/detail/index?orderNo=' + orderNo+'&orderTime='+item.orderTime + '&itemIndex='+this.data.itemIndex,
        })
      } else if (page == 'order') {
        let orderNo = e.currentTarget.dataset.id;
        let type = e.currentTarget.dataset.type;
        wx.navigateTo({
          url: `/pages/order/index?orderNo=${orderNo}&type=${type}`
        })
      }
    }

  }
})