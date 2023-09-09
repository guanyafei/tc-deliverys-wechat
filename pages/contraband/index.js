let {checkChineseCharacter} = require('../../utils/util');
let {getContrabandCopyWrite} = require('../../http/index.js');
let WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    htmlSnip:'',
    tempStr:'',
    keyword:''
  },
  onLoad() {
    getContrabandCopyWrite().then(res=>{
      if(res.code == 200){
        this.setData({
          htmlSnip:res.data,
          tempStr:res.data
        })
        WxParse.wxParse('art' , 'html', this.data.tempStr, this,5)
      } 
    });
  },
  gotSearch(e){
    let tempStr = this.data.htmlSnip;
    if(checkChineseCharacter(this.data.keyword)){
      tempStr = tempStr.replaceAll(this.data.keyword, `<span style='color:red'>${this.data.keyword}</span>`)
    }
    this.setData({
      tempStr:tempStr
    })
    WxParse.wxParse('art' , 'html', this.data.tempStr, this,5)
  }
})
