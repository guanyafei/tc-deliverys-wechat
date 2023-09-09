let {getAppreciationDocument} = require('../../http/index.js');
let WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    desc:''
  },
  onLoad(e) {
    let title = e.title;
    let type = e.type;
    wx.setNavigationBarTitle({
      title:title
    });
    if(type == 'serviceDesc'){
      let oneCode = e.oneCode;
      let params = {
        copyCode:oneCode
      };
      getAppreciationDocument(params).then(res=>{
        if(res.code == 200){
          this.setData({
            desc:res.msg
          });
          WxParse.wxParse('art' , 'html', this.data.desc, this,5)
        }
      });
    }else if(type == 'goodsDesc'){
      let des = wx.getStorageSync('pro_content') || '';
      this.setData({
        desc:des
      });
      WxParse.wxParse('art' , 'html', this.data.desc, this,5)
    }else if(type == 'privacy'){
      wx.setNavigationBarTitle({
        title: '隐私政策'
      });
    }else if(type == 'charter'){
      let params = {
        copyCode:'DZYDQY'
      };
      getAppreciationDocument(params).then(res=>{
        if(res.code == 200){
          this.setData({
            desc:res.msg
          });
          WxParse.wxParse('art' , 'html', this.data.desc, this,5)
        }
      });
    }
    //  if(type == 'goodsDesc'){
    //   wx.setNavigationBarTitle({
    //     title: '产品介绍'
    //   });
    //  }else if(type == 'privacy'){
    //   wx.setNavigationBarTitle({
    //     title: '隐私政策'
    //   });
    //  }else if(type == 'terms'){
    //   wx.setNavigationBarTitle({
    //     title: '服务条款'
    //   });
    //  }else if(type == 'charter'){
    //   wx.setNavigationBarTitle({
    //     title: '电子运单契约'
    //   });
    //  }else if(type == 'jrd'){
    //   wx.setNavigationBarTitle({
    //     title: '即日达'
    //   });
    //  }else if(type == 'ccd'){
    //   wx.setNavigationBarTitle({
    //     title: '次晨达'
    //   });
    //  }else if(type == 'crd'){
    //   wx.setNavigationBarTitle({
    //     title: '次日达'
    //   });
    //  }
  },
})
