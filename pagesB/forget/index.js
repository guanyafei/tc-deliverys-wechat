let {checkPhone,checkPassword,checkIsNull,setIndexList,checkIsInteger}= require('../../utils/util');
let {getResetPassword,getSms} = require('../../http/index.js');
Page({
  data: {
    errIndexList:[], 
    counter:60,
    resend:true,
    btnActive:false,
    tipDesc:'获取验证码',
    num:0,
    params:{
      phoneNum:'',
      phoneUuid:'',
      firstPassword:'',
      confirmPassword:'',
    }
  },
  onLoad() {
  },
  // 校验
  getCheck(e){
    let index = e.currentTarget.dataset.index,val = e.detail.value;
    if(index == 1){
      //手机号
      let telFlag = checkPhone(val);
      let item = 'params.phoneNum';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!telFlag)
      })
    }else if(index == 2){
      // 验证码
      let item = 'params.phoneUuid';
      let flag = checkIsInteger(val);
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!flag)
      })
    }else if(index == 3){
      // 密码
      let passwordFlag = checkPassword(val);
      let item = 'params.firstPassword';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!passwordFlag)
      })
    }else if(index == 4){ 
      // 确认密码
     let passwordFlag = checkPassword(val);
     let item = 'params.confirmPassword';
     if(!passwordFlag){ 
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!passwordFlag),
        errIndexList: setIndexList(this.data.errIndexList,'5',false)
       })
     }else if(passwordFlag && this.data.params.firstPassword !=val){
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,false),
        errIndexList: setIndexList(this.data.errIndexList,'5',true)
       })
     }else{
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,false),
        errIndexList: setIndexList(this.data.errIndexList,'5',false)
       })
     }
    }
    this.onBtnIsActive();
  },
  // 倒计时
  countdown(){
    if(checkIsNull(this.data['params'].phoneNum)) return;
    let params = {
      phonenumber:this.data['params'].phoneNum
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
  //提交是否激活
  onBtnIsActive(){
    this.setData({
      btnActive: this.data.errIndexList.length == 0 && !checkIsNull(this.data['params'].phoneNum) && !checkIsNull(this.data['params'].phoneUuid) && !checkIsNull(this.data['params'].firstPassword) && !checkIsNull(this.data['params'].confirmPassword)
    })
  },
  save(){
    if(checkIsNull(this.data['params'].phoneNum)){
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none',
        duration: 3000 
      });
      return;
    }
    if(checkIsNull(this.data['params'].phoneUuid)){
      wx.showToast({
        title: '请输入验证码！',
        icon: 'none',
        duration: 3000
      });
      return;
    }
    if(checkIsNull(this.data['params'].firstPassword)){
      wx.showToast({
        title: '请输入新密码！',
        icon: 'none',
        duration: 3000
      });
      return;
    }
    if(checkIsNull(this.data['params'].confirmPassword)){
      wx.showToast({
        title: '请输入确认密码！',
        icon: 'none',
        duration: 3000
      });
      return;
    }
    if(!this.data.btnActive) return;
    getResetPassword(this.data.params).then(res=>{
      if(res.code == 200){
        // wx.navigateTo({
        //   url: '/pagesB/login/index',
        // });
      }
    });
  },
  // 跳转相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    if(page == 'login'){
    //   wx.navigateTo({
    //     url: '/pagesB/login/index',
    //   });
    }
  },
})
