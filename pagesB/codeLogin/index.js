let {checkPhone,checkIsNull,setIndexList,checkIsInteger} = require('../../utils/util');
let {getLogin,getSms,getUserInfo} = require('../../http/index.js');
Page({
  data: {
    errIndexList:[],
    btnActive:false,
    counter:60,
    resend:true,
    read:true,
    tipDesc:'获取验证码',
    num:0,
    loginObj:{
      system:'APP',
      phoneLogin:true,
      username:'',
      phoneUuid:'',
    }
  },
  onLoad() {
  },
  // 校验
  getCheck(e){
    let index = e.currentTarget.dataset.index,val = e.detail.value;
    if(index==1){
      //手机号
      let accountFlag = checkPhone(val);
      let item = 'loginObj.username';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!accountFlag)
      })
    }else if(index == 2){
      // 验证码
      let flag = checkIsInteger(val);
      let item = 'loginObj.phoneUuid';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!flag)
      })
    }
    this.onBtnIsActive();
  },
  // 倒计时
  countdown(){
    if(checkIsNull(this.data['loginObj'].username)) return;
    let params = {
      phonenumber:this.data['loginObj'].username
    }
    getSms(params).then(res=>{
      if(res.code == 200){
        this.data.num++
        this.setData({
          resend:false,
          num: this.data.num
        });
        let timer = setInterval(()=>{
          this.data.counter--;
          this.setData({
            counter:this.data.counter
          });
          if (this.data.counter <=0) {
            clearInterval(timer);
            this.setData({
              resend:true,
              counter:60
            });
          if(this.data.num>0){
            this.setData({
              tipDesc:'重新发送',
            })
          }
          }
        },1000);
      }
    });
  },
  // 条款已读
  hasRead(){
    this.setData({
      read:!this.data.read
    })
  },
  // 跳转相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    if(page == 'privacy'){
      wx.navigateTo({
        url: '/pagesB/privacy/index',
      })
    }else if(page == 'terms'){
      wx.navigateTo({
        url: '/pagesB/terms/index',
      })
    }else if(page == 'login'){
    //   wx.navigateTo({
    //     url: '/pagesB/login/index',
    //   })
    }else if(page == 'register'){
      wx.navigateTo({
        url: '/pagesB/register/index',
      })
    }else if(page == 'home'){
      if(!this.data.read){
        wx.showToast({
          title: '请阅读并同意<隐私政策>。',
          icon: 'none',
          duration: 3000
        })
         return;
      }
      if(checkIsNull(this.data['loginObj'].username)){
        wx.showToast({
          title: '请输入手机号！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      if(checkIsNull(this.data['loginObj'].phoneUuid)){
        wx.showToast({
          title: '请输入验证码！', 
          icon: 'none',
          duration: 3000
        });
        return;
      }
      getLogin(this.data.loginObj).then(res=>{
        if(res.code == 200){
          wx.setStorageSync('token',res.token);
          getUserInfo({
            
          }).then(res=>{
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
          wx.switchTab({ 
            url: '/pages/home/index',
          })
        }
      });
    }
  },
  //提交是否激活
  onBtnIsActive(){
    this.setData({
      btnActive: this.data.errIndexList.length == 0 && !checkIsNull(this.data['loginObj'].username) && !checkIsNull(this.data['loginObj'].phoneUuid)
    });
  }
})
