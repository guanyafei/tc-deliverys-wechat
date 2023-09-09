let {checkPhone,checkIsNull,checkIsBeginLetterOrtherNum,checkIsHasNumberEn,checkSpecialCharacters,checkPassword,checkIsHasSpace,checkIsHasSpecialCharacters,checkSpecialCharactersSub,checkIsHasSpecialCharactersSub,setIndexList,checkSpecialCharactersAndNoChz,checkIsNoHasNumberEn,checkNumberEn,checkDelAllSpecialCharacters,debounce,checkIsInteger}= require('../../utils/util');
let {getRegistry,getSms,getEnterpriceInfo} = require('../../http/index.js');
Page({
  data: {
    errIndexList:[],
    showIndex:1,
    errMsg:'',
    counter:60,
    num:0,
    tipDesc:'获取验证码',
    resend:true,
    read:true,
    btnActive:false,
    registerObj:{
      type:'11',
      system:"APP",
      phone:'',
      phoneveri:'',
      userName:'',
      password:'',
      isnext:"1",
      companyName:'',
      taxpayerId:'',
      companyRegisteredAddress:'',
      contacts:'',
      contactsPhone:''
    }
  },
  onLoad() {
    
  },
  // 校验
  getCheck(e){
    let index = e.currentTarget.dataset.index,val = e.detail.value;
    if(index == 1){
      //手机号
      let accountFlag = checkPhone(val);
      let item = 'registerObj.phone';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!accountFlag)
      });
    }else if(index == 2){
      // 验证码
      let item = 'registerObj.phoneveri';
      let flag = checkIsInteger(val);
      this.setData({
        [item]:val,
        errMsg:'您输入的验证码有误,请重新输入！',
        errIndexList: setIndexList(this.data.errIndexList,index,!flag)
      })
    }else if(index == 3){
      //  企业用户名
      let accountFlag = checkIsBeginLetterOrtherNum(val) && checkIsHasNumberEn(val) && (this.data['registerObj'].password != val) ;
      val = checkSpecialCharacters(val);
      let item = 'registerObj.userName';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!accountFlag)
      })
     }else if(index == 4){
        // 密码
      let passwordFlag = checkPassword(val)&& val != this.data['registerObj'].userName;
      let item = 'registerObj.password';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!passwordFlag)
      })
     }else if(index == 5){ 
       // 确认密码
      let passwordFlag = this.data['registerObj'].password !=val ;
      this.setData({
        surePassword:val,
        errIndexList: setIndexList(this.data.errIndexList,index,passwordFlag)
      })
     }else if(index == 6){ 
      // 企业全称 
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharacters(val);
      val = checkSpecialCharactersAndNoChz(val);
      let item = 'registerObj.companyName';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      });
      if(!spaceFlag && !specialCharactersFlag && val!=''){
        debounce(()=>{
           getEnterpriceInfo(val).then(res=>{
              if(res.code == 200 && res.data.code==200){
                let taxpayerId = 'registerObj.taxpayerId',companyRegisteredAddress = 'registerObj.companyRegisteredAddress';;
                this.setData({
                  [taxpayerId]:res.data.taxNumber,
                  [companyRegisteredAddress]:res.data.address
                })
              }
           });
        },1000)();
      }
     }else if(index == 7){ 
      // 纳税人识别号
      let taxNumberFlag = checkIsNoHasNumberEn(val);
      val = checkNumberEn(val);
      let item = 'registerObj.taxpayerId';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,taxNumberFlag)
      })
     }else if(index == 8){ 
      //  注册地址
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharactersSub(val);
      val = checkSpecialCharactersSub(val);
      let item = 'registerObj.companyRegisteredAddress';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
     }else if(index == 9){
      //  企业联系人姓名
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharacters(val);
      val = checkDelAllSpecialCharacters(val);
      let item = 'registerObj.contacts';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
     }else if(index == 10){
      //  联系人手机号
      let accountFlag = checkPhone(val);
      let item = 'registerObj.contactsPhone';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!accountFlag)
      })
     }
    this.onBtnIsActive();
  },
  //提交是否激活
  onBtnIsActive(){
    let flag = false;
    if(this.data.showIndex == 1){
      flag = (this.data.read && this.data.errIndexList.length == 0 && !checkIsNull(this.data['registerObj'].phone) && !checkIsNull(this.data['registerObj'].password) && !checkIsNull(this.data['registerObj'].phoneveri) && !checkIsNull(this.data['registerObj'].userName))?true:false;
    }else{
      flag = (this.data.read && this.data.errIndexList.length == 0 && !checkIsNull(this.data['registerObj'].companyName) && !checkIsNull(this.data['registerObj'].taxpayerId) && !checkIsNull(this.data['registerObj'].companyRegisteredAddress) && !checkIsNull(this.data['registerObj'].contacts) && !checkIsNull(this.data['registerObj'].contactsPhone))?true:false;;
    }
    this.setData({ 
      btnActive: flag
    });
  },
  // 条款已读
  hasRead(){
    this.setData({
      read:!this.data.read
    });
    this.onBtnIsActive();
  },
  // 倒计时
  countdown(){
    if(checkIsNull(this.data['registerObj'].phone)) return;
    let params = {
        phonenumber:this.data['registerObj'].phone
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
  // 下一步
  goNext(){
    if(this.data.showIndex == 3) return;
    let params={};
    if(!this.data.read){
      wx.showToast({
        title: '请阅读并同意<隐私条款>！',
        icon: 'none',
        duration: 3000
      });
      return;
    }
    if(this.data.showIndex == 1){
      if(checkIsNull(this.data['registerObj'].phone)){
        wx.showToast({
          title: '请输入手机号！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      if(checkIsNull(this.data['registerObj'].phoneveri)){
        wx.showToast({
          title: '请输入验证码！',
          icon: 'none', 
          duration: 3000
        });
        return;
      }
      if(checkIsNull(this.data['registerObj'].userName)){
        wx.showToast({
          title: '请输入企业用户名！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      if(checkIsNull(this.data['registerObj'].password)){
        wx.showToast({
          title: '请输入密码！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      params = {
        type:'11',
        system:"APP",
        phone:this.data['registerObj'].phone,
        phoneveri:this.data['registerObj'].phoneveri,
        userName:this.data['registerObj'].userName,
        password:this.data['registerObj'].password,
        isnext:"1",
      }
      getRegistry(params).then(res=>{
         if(res.code==200){
           let contactsPhone = "registerObj.contactsPhone";
          this.setData({
            [contactsPhone]:this.data['registerObj'].phone,
            showIndex:++this.data.showIndex,
            btnActive:false,
            errIndexList:[],
          })
         }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3000
          })
         }
      });
    }else if(this.data.showIndex == 2){
      if(checkIsNull(this.data['registerObj'].companyName)){
        wx.showToast({
          title: '请输入企业全称！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      if(checkIsNull(this.data['registerObj'].taxpayerId)){
        wx.showToast({
          title: '请输入纳税人识别号！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      if(checkIsNull(this.data['registerObj'].companyRegisteredAddress)){
        wx.showToast({
          title: '请输入纳税企业注册地址！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      if(checkIsNull(this.data['registerObj'].contacts)){
        wx.showToast({
          title: '请输入企业联系人姓名！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      if(!this.data.read){
        wx.showToast({
          title: '请阅读并同意<隐私政策>。',
          icon: 'none',
          duration: 3000
        })
         return;
      }
      params = {
        type:'11',
        system:"APP",
        phone:this.data['registerObj'].phone,
        phoneveri:this.data['registerObj'].phoneveri,
        userName:this.data['registerObj'].userName,
        password:this.data['registerObj'].password,
        isnext:"2",
        companyName:this.data['registerObj'].companyName,
        taxpayerId:this.data['registerObj'].taxpayerId,
        companyRegisteredAddress:this.data['registerObj'].companyRegisteredAddress,
        contacts:this.data['registerObj'].contacts,
        contactsPhone:this.data['registerObj'].contactsPhone,
      }
      getRegistry(params).then(res=>{
        if(res.code==200){
         this.setData({
           showIndex:++this.data.showIndex,
           btnActive:false,
           errIndexList:[],
         })
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3000
          })
        }
     });
    };
  },
  // 跳转相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    if(page == 'privacy'){
      wx.navigateTo({
        url: '/pagesB/privacy/index',
      })
    }else if(page == 'login'){
      if(!this.data.read){
        wx.showToast({
          title: '请阅读并同意<隐私政策>。',
          icon: 'none',
          duration: 3000
        })
         return;
      };
    //   wx.navigateTo({
    //     url: '/pagesB/login/index', 
    //   })
    }
  },
})
