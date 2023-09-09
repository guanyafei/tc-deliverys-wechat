let {checkSpecialCharactersTT,checkIsHasSpace,checkIsHasSpecialCharacters,checkIsNoHasNumberEn,checkNumberEn,checkIsTel,checkTel,checkIsHasSpecialCharactersSub,checkSpecialCharactersSub,checkCharactersNum,checkIsHasNumberEn,checkPhone,setIndexList,checkIsNull } = require('../../utils/util');
let {getAddInvoice,getInvoiceDetail,getEditInvoice} = require('../../http/index.js');
Page({
  data: {
    detailId:'',
    errIndexList:[],
    switch:false,
    selectFlag:true,
    btnActive:false,
    params:{
      authentication_type:'1',
      bank_account:'',
      bank_name:'',
      business_duty:'',
      create_name:'',
      invoice_rise:'',
      is_default:'1',
      phone:'',
      receive_address:'',
      receive_name:'',
      receive_phone:'',
      register_telephone:'',
      rise_type:'1',
      user_name:'',
      register_address:''
    }
  },
  onLoad(e) {
    let type = e.page,id=e.id;
    if(type == 'edit'){
      wx.setNavigationBarTitle({
        title: '编辑发票抬头'
      });
      if(id) this.setData({detailId:id});
      this.getInvoiceDetail();
    }else if(type == 'add'){
      wx.setNavigationBarTitle({
        title: '添加发票抬头'
      });
    }
    let userInfo = wx.getStorageSync('userInfo');
    let userName = 'params.user_name';
    let nikeName = 'params.create_name';
    let businessDuty = 'params.business_duty';
    let invoiceRise = 'params.invoice_rise';
    this.setData({
      [userName]:userInfo.userName,
      [nikeName]:userInfo.nickName,
      [businessDuty]:userInfo.taxpayerId,
      [invoiceRise]:userInfo.companyConsumerName,
    });
  },
  // 修改获取抬头详情
  getInvoiceDetail(){
    getInvoiceDetail(this.data.detailId).then(res=>{
      if(res.code == 200){
        let riseType = 'params.rise_type';
        let bankAccount = 'params.bank_account';
        let bankName = 'params.bank_name';
        let businessDuty = 'params.business_duty';
        let createName = 'params.create_name';
        let invoiceRise = 'params.invoice_rise';
        let isDefault = 'params.is_default';
        let phone = 'params.phone';
        let receiveAddress = 'params.receive_address';
        let receiveName = 'params.receive_name';
        let receivePhone = 'params.receive_phone';
        let registerTelephone = 'params.register_telephone';
        let userName = 'params.user_name';
        let registerAddress = 'params.register_address';
        let authenticationType = 'params.authentication_type';
        this.setData({
          [riseType]:res.data.riseType,
          [bankAccount]:res.data.bankAccount,
          [authenticationType]:res.data.authenticationType,
          [bankName]:res.data.bankName,
          [businessDuty]:res.data.businessDuty,
          [createName]:res.data.createName,
          [invoiceRise]:res.data.invoiceRise,
          [isDefault]:res.data.isDefault,
          [phone]:res.data.phone,
          [receiveAddress]:res.data.receiveAddress,
          [receiveName]:res.data.receiveName,
          [receivePhone]:res.data.receivePhone,
          [registerTelephone]:res.data.registerTelephone,
          [userName]:res.data.userName,
          [registerAddress]:res.data.registerAddress,
          switch:res.data.authenticationType=='1'?false:true,
          selectFlag:res.data.isDefault=='1'?true:false,
          btnActive:true
        });
      }
    });
  },
  // 设置默认
  selectItem(){
    let item = 'params.is_default';
    this.setData({
      selectFlag:!this.data.selectFlag,
      [item]:!this.data.selectFlag?'1':'0'
    })
  },
  // 校验
  getCheck(e){
    let index = e.currentTarget.dataset.index,val = e.detail.value;
    if(index == 1){
      // 公司名称
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharacters(val);
      val = checkSpecialCharactersTT(val);
      let item = 'params.invoice_rise';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
    }else if(index == 2){
      // 公司税号
      let taxNumberFlag = checkIsNoHasNumberEn(val);
      val = checkNumberEn(val);
      let item = 'params.business_duty';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,taxNumberFlag)
      })
    }else if(index == 3){
      // 注册地址
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharactersSub(val);
      val = checkSpecialCharactersSub(val);
      let item = 'params.register_address';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
    }else if(index == 4){
      // 注册电话
      let phoneFlag = checkIsTel(val);
      val = checkTel(val);
      let item = 'params.register_telephone';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,phoneFlag)
      })
    }else if(index == 5){
      // 开户银行
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharactersSub(val);
      val = checkSpecialCharactersSub(val);
      let item = 'params.bank_name';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
    }else if(index == 6){
      // 银行账号
      let bankAccountFlag = checkIsHasNumberEn(val);
      val = checkCharactersNum(val);
      let item = 'params.bank_account';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!bankAccountFlag)
      })
    }else if(index == 7){
      // 收件人姓名
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharactersSub(val);
      val = checkSpecialCharactersSub(val);
      let item = 'params.receive_name';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
    }else if(index == 8){
      // 收件人电话
      let reciverPhoneFlag = checkPhone(val);
      let item = 'params.receive_phone';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!reciverPhoneFlag)
      })
    }else if(index == 9){
      // 收件人地址
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharactersSub(val);
      val = checkSpecialCharactersSub(val);
      let item = 'params.receive_address';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
    }else if(index == 10){
      // 收件人电话
      let phoneFlag = checkPhone(val);
      let item = 'params.phone';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!phoneFlag)
      })
    }
    this.onBtnIsActive();
  },  
  //提交是否激活
  onBtnIsActive(){
    let flag = false;
    if(this.data.params.rise_type=='1'){ 
      if(this.data.switch){
        flag = (this.data.errIndexList.length == 0 && !checkIsNull(this.data['params'].invoice_rise) && !checkIsNull(this.data['params'].business_duty) && !checkIsNull(this.data['params'].register_address) && !checkIsNull(this.data['params'].register_telephone) && !checkIsNull(this.data['params'].bank_name) && !checkIsNull(this.data['params'].bank_account) && !checkIsNull(this.data['params'].receive_name) && !checkIsNull(this.data['params'].receive_phone) && !checkIsNull(this.data['params'].receive_address))?true:false;
      }else{
        flag = (this.data.errIndexList.length == 0 && !checkIsNull(this.data['params'].invoice_rise) && !checkIsNull(this.data['params'].business_duty) && !checkIsNull(this.data['params'].phone))?true:false;
      }
    }else{
      flag = (this.data.errIndexList.length == 0 && !checkIsNull(this.data['params'].invoice_rise) && !checkIsNull(this.data['params'].phone))?true:false;;
    }
    this.setData({ 
      btnActive: flag
    });
  },
  // 是否认证为专票
  switchClick(e){
    let val = e.detail.value;
    // 纸质专票地址数据初始化
    ['7','8','9'].forEach(item=>{
        if(this.data.errIndexList.includes(item)){
          this.data.errIndexList.splice(this.data.errIndexList.indexOf(item),1)
          this.setData({
            errIndexList: this.data.errIndexList
          })
        }
    });
    this.setData({
      switch:val,
      receive_address:'',
      receive_name:'',
      receive_phone:''
    });
    this.onBtnIsActive();
  },
  // 切换tab
  changeTab(e){
    let type = e.currentTarget.dataset.type,params=null,riseType='params.rise_type';
    if(!this.data.detailId){
      params = {
        authentication_type:'1',
        bank_account:'',
        bank_name:'',
        is_default:'1',
        phone:'',
        receive_address:'',
        receive_name:'',
        receive_phone:'',
        register_telephone:'',
        register_address:''
      };
      this.setData({
        params:Object.assign(this.data.params,params),
      })
    }
    this.setData({
      [riseType]:type,
      switch:false
    })
  },
  // 提交
  save(){
    if(!this.data.btnActive) return;
    let params = {};
    if(this.data.params.rise_type=='1'){
      this.data.params.authentication_type = this.data.switch?'2':'1';
      params = this.data.params;
    }else{
      params = {
        authentication_type:'1',
        rise_type:this.data.params.rise_type,
        invoice_rise:this.data.params.invoice_rise,
        phone:this.data.params.phone,
        user_name:this.data.params.user_name,
        create_name:this.data.params.create_name,
        is_default:this.data.params.is_default
      }
    }
    if(this.data.detailId){
      // 修改
      params['id']=this.data.detailId;
      getEditInvoice(params).then(res=>{
        if(res.code == 200){
          wx.navigateBack()
        }
      });
    }else{
      // 新增
      getAddInvoice(params).then(res=>{
        console.log("resres",res) 
        if(res.code == 200){
           wx.navigateBack()
        }else if(res.code == 201){
          wx.showToast({
            title: res.msg,
            icon:'none',
            duration:3000
          })
        }
     });
    }
  }
})
