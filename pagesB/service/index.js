let {getProductList,getAppreciation,getUserInfo} = require('../../http/index.js');
Page({
  data: {
    showIndex:1,
    list:[]
  },
  onLoad(e) {
    let type = e.type;
    if(type == 'service') {
      this.setData({
        showIndex:1
      });
      wx.setNavigationBarTitle({
        title: '增值服务'
      });
      getAppreciation().then(res=>{
        if(res.code == 200){
          this.setData({
            list:res.data || []
          })
        }
      });
     }else if(type == 'serviceQuery'){
      this.setData({
        showIndex:2
      });
      wx.setNavigationBarTitle({
        title: '服务查询'
      });
     }else if(type == 'goodsDesc'){
      this.setData({
        showIndex:3
      });
      wx.setNavigationBarTitle({
        title: '产品介绍'
      });
      getProductList().then(res=>{
         if(res.code == 200){
           this.setData({
             list:res.data || []
           })
         }
      });
     }
  },
  // 跳转相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    if(page == 'addServiceDesc'){
      let index =  e.currentTarget.dataset.index;
      let item = this.data.list[index];
      wx.navigateTo({
        url: `/pagesB/introduce/index?title=${item.oneName}&oneCode=${item.oneCode}&type=serviceDesc`,
      })
    }else if(page == 'introduce'){
      let index =  e.currentTarget.dataset.index;
      let item = this.data.list[index];
      wx.setStorageSync("pro_content",item.pro_content); 
      wx.navigateTo({
        url: `/pagesB/introduce/index?title=${item.pro_name}&type=goodsDesc`,
      })
    }else if(page == 'goodsDesc'){
      wx.navigateTo({
        url: '/pagesB/service/index?type=goodsDesc',
      })
    }else if(page == 'service'){
      this.setData({
        showIndex:1
      });
      wx.setNavigationBarTitle({
        title: '增值服务'
      });
      getAppreciation().then(res=>{
        if(res.code == 200){
          this.setData({
            list:res.data || []
          })
        }
      });
    }else if(page == 'serviceArea'){
      wx.navigateTo({
        url: '/pagesB/serviceArea/index',
      })
    }else if(page == 'contraband'){
      getUserInfo({
        tip:'登录提示',
        subTitle:'当前操作需要您进行登录'
      }).then(res=>{
        if(res.code==200){
          wx.navigateTo({
            url: '/pages/contraband/index',
          })
        }
      });
     
    }else if(page == 'aging'){
      wx.navigateTo({
        url: '/pagesB/aging/index',
      })
    }
  }
})
