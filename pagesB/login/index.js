let {checkSpecialCharacters,checkIsBeginLetterOrtherNum,checkIsHasNumberEn,checkPassword,checkIsNull,setIndexList} = require('../../utils/util');
let {getLogin,getUserInfo} = require('../../http/index.js');
Page({
  data: {
    btnActive:false,
    see:false,
    errIndexList:[],
    passwordType:'password',
    loginObj:{
      system:'APP',
      username:'',
      password:'',
    } 
  },
  onLoad() {
    
  },
  // 校验
  getCheck(e){
    let index = e.currentTarget.dataset.index,val = e.detail.value;
     if(index == 1){
      //  企业账号
      let accountFlag = checkIsBeginLetterOrtherNum(val) && checkIsHasNumberEn(val);
      val = checkSpecialCharacters(val);
      let item = 'loginObj.username';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!accountFlag)
      })
     }else if(index == 2){
      // 密码
      let passwordFlag = checkPassword(val);
      let item = 'loginObj.password';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!passwordFlag)
      })
     }
     this.onBtnIsActive();
  },
  // 跳转相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    if(page == 'privacy'){
      wx.navigateTo({
        url: '/pagesB/privacy/index',
      })
    }else if(page == 'home'){
      if(checkIsNull(this.data['loginObj'].username)){
        wx.showToast({
          title: '请输入企业账号！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      if(checkIsNull(this.data['loginObj'].password)){
        wx.showToast({
          title: '请输入密码！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      getLogin(this.data.loginObj).then(res=>{
        if(res.code == 200){
          wx.setStorageSync('token',res.token);
          getUserInfo({}).then(res=>{
            if(res.code==200){ 
              wx.setStorageSync('userInfo',{
                consumerName:res.user.shopCompany.consumerName || '',
                nickName:res.user.nickName || '',
                userType:res.user.userType,
                phonenumber:res.user.phonenumber,
                avatar:res.user.avatar || '../../assets/images/logo@2x.png',
                userName:res.user.userName,
                companyConsumerName:res.user.shopCompany.companyConsumerName,
                companyRegisteredAddress:res.user.shopCompany.companyRegisteredAddress,
                taxpayerId:res.user.shopCompany.taxpayerId || '',
                consumerSignStatus:res.user.shopCompany.consumerSignStatus,
                companyMonthlyInvoicing:res.user.shopCompany.companyMonthlyInvoicing,
                companySettlementType:res.user.shopCompany.companySettlementType ,
                consumerCode:res.user.shopCompany.consumerCode,
                companyMonthlyInvoicing:res.user.shopCompany.companyMonthlyInvoicing ,
                balanceConsumerName:res.user.shopCompany.balanceConsumerName,
                balanceLoginNo:res.user.shopCompany.balanceLoginNo,
              });
            }
          });
          wx.reLaunch({ 
            url: '/pages/home/index',
          })
        }
      });
    }else if(page == 'codeLogin'){
    //   wx.navigateTo({
    //     url: '/pagesB/codeLogin/index', 
    //   })
    }else if(page == 'register'){
      wx.navigateTo({
        url: '/pagesB/register/index', 
      })
    }else if(page == 'forget'){
      wx.navigateTo({
        url: '/pagesB/forget/index', 
      })
    }
  },
  // 是否可见
  onCanSee(){
    this.setData({
      see:!this.data.see,
      passwordType:this.data.see?'text':'password'
    })
  },
  //提交是否激活
  onBtnIsActive(){
    this.setData({
      btnActive: this.data.errIndexList.length == 0 && !checkIsNull(this.data['loginObj'].username) && !checkIsNull(this.data['loginObj'].password)
    })
  }
})
