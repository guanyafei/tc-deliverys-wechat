let {getServiceArea} = require('../../http/index.js');
Page({
  data: {
    alladders:'',
    showAddress:false,
    addersObj:[{
      firstArea:'',
      firstCode:''
    },
    {
      firstArea:'',
      firstCode:''
    },
    {
      firstArea:'',
      firstCode:''
    },
    {
      firstArea:'',
      firstCode:''
    }],
    site:'',
    isSupport:'0'
  },
  onLoad() {
  },
  // 查询
  onSearch(){
    getServiceArea(this.data.addersObj[3].firstCode).then(res=>{
      if(res.code == 200){
        this.setData({
          site:`${this.data.addersObj[0].firstArea}${this.data.addersObj[1].firstArea}${this.data.addersObj[2].firstArea}${this.data.addersObj[3].firstArea}`,
          isSupport:res.data.is_ps
        })
      }else{
        this.setData({
          site:`${this.data.addersObj[0].firstArea}${this.data.addersObj[1].firstArea}${this.data.addersObj[2].firstArea}${this.data.addersObj[3].firstArea}`,
          isSupport:'0'
        })
      } 
    });
  },
  // 获取地址
  getAddress(e){
    this.setData({
      showAddress:false,
      addersObj:e.detail.params.area,
      alladders:e.detail.params.alladders,
      site:'',
      isSupport:'0'
    })
  },
  // 显示地址弹框
  showAddress(e){
    this.setData({
      showAddress:true,
    })
  },
  closeAddress(e){
    let flag = e.detail.params;
    this.setData({
      showAddress:flag,
    })
  },
})
