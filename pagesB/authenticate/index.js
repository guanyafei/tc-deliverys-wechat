let {getAuthCode,getOauthRegistor,getCheckAuth} = require('../../http/index.js');
let {checkIsNull,checkIsHasSpace,checkIsHasSpecialCharacters,setIndexList,checkID,checkDelAllSpecialCharacters,checkIDIsHasOther,checkIsInteger} = require('../../utils/util');
Page({
  data: {
    code:'',
    counter:60,
    resend:true,
    name:'',
    ID:'',
    showIndex:1,
    codeError:false,
    errIndexList:[],
    btnActive:false,
    tipDesc:'获取验证码',
    num:0,
    params:{
      customerPhone:'', 
      customerName:'',
      customerAccount:'',
      idCard:'',
      verifCode:''
    }
  },
  onLoad() {
    let userInfo = wx.getStorageSync('userInfo');
    let customerPhone = 'params.customerPhone';
    let customerAccount = 'params.customerAccount';
    this.setData({
      [customerPhone]:userInfo.phonenumber,
      [customerAccount]:userInfo.userName,
    })
  },
  // 倒计时
  countdown(){
    if(checkIsNull(this.data['params'].customerPhone)) return;
    let params = {
      customerPhone:this.data['params'].customerPhone,
      customerAccount:this.data.params.customerAccount
    }
    getAuthCode(params).then(res=>{
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
  // 校验
  getCheck(e){
    let index = e.currentTarget.dataset.index,val = e.detail.value;
    if(index == 1){
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharacters(val);
      val = checkDelAllSpecialCharacters(val);
      let item = 'params.customerName';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      });
    }else if(index == 2){
      let spaceFlag = checkIsHasSpace(val),idFlag = checkID(val);
      val = checkIDIsHasOther(val);
      let item = 'params.idCard';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || !idFlag)
      });
    }else if(index == 3){
      let item = 'params.verifCode';
      // let flag = checkIsInteger(val);
      this.setData({
        [item]:val,
        // errIndexList: setIndexList(this.data.errIndexList,index,!flag)
      });
    }
    this.onBtnIsActive();
  },
  //提交是否激活
  onBtnIsActive(){
    if(this.data.showIndex==2){
      this.setData({
        btnActive: this.data.errIndexList.length == 0 && !checkIsNull(this.data['params'].customerPhone) && !checkIsNull(this.data['params'].idCard)
      })
    }else{
      this.setData({
        btnActive: this.data.errIndexList.length == 0 && !checkIsNull(this.data['params'].verifCode)
      })
    }
  },
  // 下一步
  goNext(){
    if(this.data.showIndex == 3 || !this.data.btnActive) return
    if(this.data.showIndex == 2){
      if(checkIsNull(this.data['params'].customerName)){
        wx.showToast({
          title: '请输入姓名！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      if(checkIsNull(this.data['params'].idCard)){
        wx.showToast({
          title: '请填写身份证号码！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      if(!this.data.btnActive) return;
      getOauthRegistor(this.data.params).then(res=>{
        if(res.code == 200){
          this.setData({
            showIndex:++this.data.showIndex
          });
        }
      });
    }
    if(this.data.showIndex == 1){
      if(checkIsNull(this.data['params'].verifCode)){
        wx.showToast({
          title: '请填写验证码！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      if(!this.data.btnActive) return;
      getCheckAuth({ 
        customerPhone:this.data.params.customerPhone, 
        customerAccount:this.data.params.customerAccount,
        verifCode:this.data.params.verifCode
      }).then(res=>{
        if(res.code == 200){
          this.setData({
            showIndex:++this.data.showIndex,
            btnActive:false
          });
        }
      });
    }
  },
  // 返回
  goBack(){
    wx.navigateBack()
  }
})
