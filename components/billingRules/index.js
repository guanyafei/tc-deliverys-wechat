let {getAppreciationDocument} = require('../../http/index.js');
let WxParse = require('../../wxParse/wxParse.js');
Component({
  /**
   * 组件的初始数据
   */
  data: {
    desc:''
  },
  lifetimes:{
    attached: function() {
      // 在组件实例进入页面节点树时执行
      getAppreciationDocument({
        copyCode: "JFGZ"
      }).then(res=>{
        if(res.code == 200){
          this.setData({
            desc:res.msg
          });
          WxParse.wxParse('art' , 'html', this.data.desc, this,5)
        }
      });
    },
  },
  properties:{
   
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //关闭弹窗
    closed(){
      this.triggerEvent('closerules',{params:false});
    },
  }
})

