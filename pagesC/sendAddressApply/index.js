
Page({
  data: {
    errMsg:'增加新的寄件地址：申请增加新的寄件地址需增加相应业务账号来进行操作取件，该业务账号将以子账号形式提供，具体请联系相应业务人员。',
    showAddress:false,
    addersObj:[
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
      },
      {
        firstArea:'',
        firstCode:''
      }
    ]
  },
  onLoad(e) {
   
  },
  // 显示地址弹框
  showAddress(e){
    this.setData({
      showAddress:true,
    })
  },
  // 获取地址
  getAddress(e){
    this.setData({
      showAddress:false,
      alladders:e.detail.params.alladders
    })
  },
  closeAddress(e){
    let flag = e.detail.params;
    this.setData({
      showAddress:flag,
    })
  },
  // 提交
  save(){
    wx.showModal({
      title: '系统提示',
      content: '是否提交增加新的寄件地址申请？',
      confirmText:'确定',
      confirmColor:'#466FED',
      cancelColor:'#2F2F2F',
      success:(res)=>{
        if (res.confirm) {
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
