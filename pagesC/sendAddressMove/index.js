let {checkIsHasSpace,checkIsHasSpecialCharactersSub,checkSpecialCharactersSub,setIndexList,checkIsNull}= require('../../utils/util');
let {getSubmitAddressMove} = require('../../http/index.js');
Page({
  data: {
    errMsg:'地址搬迁：寄件地址发生变更，该月结账号默认寄件地址将被新地址替代，原地址快递取件服务将不再享受月结优惠政策。',
    showAddress:false,
    showToast:false,
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
    errIndexList:[],
    checkImg:'',
    companyMonthlyInvoicing:'',
    balanceConsumerName:'',
    sendAddress:'',
    alladders:'',
    params:{
      userName:'',
      bookProvince:'',
      bookProvinceName:'',
      bookCity:'',
      bookCityName:'',
      bookDistrict:'',
      bookDistrictName:'',
      bookStreet:'',
      bookStreetName:'',
      bookAddress:'',
      moveConsumerLoginNo:''
    }
  },
  onLoad(options) {
    let userInfo = wx.getStorageSync('userInfo');
    let userName = 'params.userName';
    let moveConsumerLoginNo = 'params.moveConsumerLoginNo';
    this.setData({
      sendAddress:options.bookAddress,
      balanceConsumerName:userInfo.balanceConsumerName,
      companyMonthlyInvoicing:userInfo.companyMonthlyInvoicing,
      [userName]:userInfo.userName,
      [moveConsumerLoginNo]:userInfo.userName
    });
  },
  // 校验
  getCheck(e){
    let index = e.currentTarget.dataset.index,val = e.detail.value;
    if(index == 1){
      // 详细地址
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharactersSub(val);
      val = checkSpecialCharactersSub(val);
      let address = "params.bookAddress";
      this.setData({
        [address]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
    }
  },
  // 获取地址
  getAddress(e){
    let params = e.detail.params;
    let book_province_name = 'params.bookProvinceName';
    let book_province = 'params.bookProvince';
    let book_city_name = 'params.bookCityName';
    let book_city = 'params.bookCity';
    let book_district_name = 'params.bookDistrictName';
    let book_district = 'params.bookDistrict';
    let book_street_name = 'params.bookStreetName';
    let book_street = 'params.bookStreet';
    this.setData({
      showAddress:false,
      addersObj:params.area,
      alladders:params.alladders,
      [book_province_name]:params.area[0]['firstArea'],
      [book_province]:params.area[0]['firstCode'],
      [book_city_name]:params.area[1]['firstArea'],
      [book_city]:params.area[1]['firstCode'],
      [book_district_name]:params.area[2]['firstArea'],
      [book_district]:params.area[2]['firstCode'],
      [book_street_name]:params.area[3]['firstArea'],
      [book_street]:params.area[3]['firstCode'],
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
  // 提交
  save(){
    if(this.data.address == ''){
      this.showToast('请输入收件人详细地址。');
      return;
    } 
    if(checkIsNull(this.data.alladders)){
      wx.showToast({
        title: '请选择寄件人地址！',
        icon: 'none',
        duration: 3000
      });
      return;
    }
    if(checkIsNull(this.data.params.bookAddress)){
      wx.showToast({
        title: '请输入寄件人详细地址！',
        icon: 'none',
        duration: 3000
      });
      return;
    }
    wx.showModal({
      title: '系统提示',
      content: '是否提交搬迁地址申请？',
      confirmText:'确定',
      confirmColor:'#466FED',
      cancelColor:'#2F2F2F',
      success:(res)=>{
        if (res.confirm) {
          getSubmitAddressMove(this.data.params).then(res=>{
            if(res.code == 200){
              wx.navigateBack();
            }
            // else{
            //   this.showToast('新地址已超出月结账号范围。');
            // }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  showToast(msg){
    this.setData({
      showToast:true,
      checkMsg:msg
    });
    let timer = setTimeout(()=>{
      clearTimeout(timer);
      this.setData({
        showToast:false,
        checkImg:''
      });
    },3000)
  },
})
