let {getListInvoice,getAppInvoice,getInvoiceChange,getInvoiceUpdate} = require('../../http/index.js');
let {checkSpecialCharactersTT,checkIsHasSpace,checkIsHasSpecialCharacters,checkIsTel,checkTel,checkIsHasSpecialCharactersSub,checkSpecialCharactersSub,checkCharactersNum,checkIsHasNumberEn,checkPhone,setIndexList,checkIsNull } = require('../../utils/util');
Page({
  data: {
    errIndexList:[],
    params:{
      source:'4',
      invoiceType:'1',
      titleType:'2',
      title:'',
      taxNo:'',
      telephone:'',
      registerPhone:'',
      invoiceAmount:'',
      receiveUserAddress:'',
      receiveUserName:'',
      receiveUserPhone:'',
      accountBank:'',
      bankNum:'',
      deliveryNos:'',
      orderNos:'',
      address:''
    },
    invoiceNo:'', //发票流水号 换开 重新申请使用
    status:'SQ' //SQ:第一次申请  CXSQ：重新申请 HK：换开
  },
  onLoad(option) {
    let deliveryNos = 'params.deliveryNos';
    let orderNos = 'params.orderNos';
    let invoiceAmount = 'params.invoiceAmount';
   this.setData({
    [deliveryNos]:option.invoiceDeliveryNoList.split(',').join('、'),
    [orderNos]:option.orderNoList.split(',').join('、'),
    [invoiceAmount]:option.totalPrice,
    status:option.status?option.status:this.data.status
   });
  //  获取抬头列表 查找是否有默认
  let userInfo = wx.getStorageSync('userInfo'); 
  let params={
    user_name:userInfo.userName,
    search_value:'',
    authentication_type: '',
    rise_type: '',
  }
  // 换开
  if(this.data.status == 'HK' || this.data.status == 'CXSQ'){
    let invoiceItem = JSON.parse(option.invoiceItem);
    this.reSetInvoiceData(invoiceItem,this.data.status);
    this.onBtnIsActive();
    return
  }
  if(this.data.status != 'SQ') return;
   getListInvoice(params).then(res=>{
      let invoiceType = 'params.invoiceType';
      let titleType = 'params.titleType';
      if(res.code == 200 && !checkIsNull(res.data)){
        const defaultInvoice = res.data.find(item=> {
          return item.isDefault=='1';
        });
        if(!!defaultInvoice){
          this.reSetInvoiceData(defaultInvoice);
        }else{
          this.setData({
            [invoiceType]:'1',
            [titleType]:'2',
          });
        }
        this.onBtnIsActive();
      }else if(res.code == 200 && checkIsNull(res.data)){
        this.setData({
          [invoiceType]:'1',
          [titleType]:'2',
        });
      }
   });
  },
  // 换开 重新申请 申请开票数据初始化
  reSetInvoiceData(item,status="SQ"){
    let invoiceType = 'params.invoiceType';
    let titleType = 'params.titleType';
    let title = 'params.title';
    let taxNo = 'params.taxNo';
    let telephone = 'params.telephone';
    let address = 'params.address';
    let receiveUserName = 'params.receiveUserName';
    let receiveUserAddress = 'params.receiveUserAddress';
    let receiveUserPhone = 'params.receiveUserPhone';
    let accountBank = 'params.accountBank';
    let bankNum = 'params.bankNum';
    let registerPhone = 'params.registerPhone';
    if(status == 'SQ'){
      this.setData({
        [invoiceType]:item.authenticationType,
        [titleType]:item.riseType,
        [title]:item.invoiceRise,
        [taxNo]:item.businessDuty,
        [telephone]:item.phone,
        [address]:item.registerAddress,
        [receiveUserAddress]:item.receiveAddress,
        [receiveUserName]:item.receiveName,
        [receiveUserPhone]:item.receivePhone,
        [accountBank]:item.bankName,
        [bankNum]:item.bankAccount,
        [registerPhone]:item.registerTelephone,
      });
    }else if(status == 'HK'){
      let userInfo = wx.getStorageSync('userInfo'); 
      if(item.titleType=='1' && item.invoiceType=='1'){
        let params={
          user_name:userInfo.userName,
          search_value:'',
          authentication_type: '1',
          rise_type: '2',
        }
        getListInvoice(params).then(res=>{
          if(res.code == 200 && !checkIsNull(res.data)){
            const defaultInvoice = res.data.find(item=> {
              return item.isDefault=='1';
            });
            if(!!defaultInvoice){
              this.setData({
                [invoiceType]:item.invoiceType,
                [titleType]:item.titleType=='1'?'2':'1', 
                [title]:defaultInvoice.invoiceRise,
                [taxNo]:defaultInvoice.businessDuty,
                [telephone]:defaultInvoice.phone,
                invoiceNo:item.invoiceNo
              });
            }else{
              this.setData({
                [invoiceType]:item.invoiceType,
                [titleType]:item.titleType=='1'?'2':'1', 
                [title]:item.titleType=='1'?'':userInfo.companyConsumerName,
                [taxNo]:item.titleType=='1'?'':userInfo.taxpayerId,
                invoiceNo:item.invoiceNo,
                [telephone]:item.titleType=='1'?'':userInfo.phonenumber,
              });
            }
            this.onBtnIsActive();
          }
       });
      }else{
        this.setData({
          [invoiceType]:item.invoiceType,
          [titleType]:item.titleType=='1'?'2':'1', 
          [title]:item.titleType=='1'?'':userInfo.companyConsumerName,
          [taxNo]:item.titleType=='1'?'':userInfo.taxpayerId,
          invoiceNo:item.invoiceNo,
          [telephone]:item.titleType=='1'?'':userInfo.phonenumber,
        });
      }
      
    }else{
      this.setData({
        [invoiceType]:item.invoiceType,
        [titleType]:item.titleType,
        [title]:item.title,
        [taxNo]:item.taxNo,
        [telephone]:item.telephone,
        [address]:item.address,
        [receiveUserAddress]:item.receiveAddress,
        [receiveUserName]:item.receiveName,
        [receiveUserPhone]:item.receivePhone,
        [accountBank]:item.bankName, 
        [bankNum]:item.bankAccount,
        [registerPhone]:item.registerPhone,
        invoiceNo:item.invoiceNo
      });
    }
  },
  // 校验
  getCheck(e){
    let index = e.currentTarget.dataset.index,val = e.detail.value;
    if(index == 1){
      // 公司名称
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharacters(val);
      val = checkSpecialCharactersTT(val);
      let item = 'params.title';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
    }else if(index == 2){
      // 注册地址
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharactersSub(val);
      val = checkSpecialCharactersSub(val);
      let item = 'params.address';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
    }else if(index == 3){
      // 注册电话
      let phoneFlag = checkIsTel(val);
      val = checkTel(val);
      let item = 'params.registerPhone';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,phoneFlag)
      })
    }else if(index == 4){
      // 开户银行
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharactersSub(val);
      val = checkSpecialCharactersSub(val);
      let item = 'params.accountBank';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
    }else if(index == 5){
      // 银行账号
      let bankAccountFlag = checkIsHasNumberEn(val);
      val = checkCharactersNum(val);
      let item = 'params.bankNum';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!bankAccountFlag)
      })
    }else if(index == 6 || index==7){
      // 联系电话
      let reciverPhoneFlag = checkPhone(val);
      let item = 'params.telephone';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!reciverPhoneFlag)
      })
    }else if(index == 8){
      // 收件人姓名
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharactersSub(val);
      val = checkSpecialCharactersSub(val);
      let item = 'params.receiveUserName';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
    }else if(index == 9){
      // 收件人电话
      let reciverPhoneFlag = checkPhone(val);
      let item = 'params.receiveUserPhone';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!reciverPhoneFlag)
      })
    }else if(index == 10){
      // 收件人地址
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharactersSub(val);
      val = checkSpecialCharactersSub(val);
      let item = 'params.receiveUserAddress';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
    }
    this.onBtnIsActive();
  }, 
  //提交是否激活
  onBtnIsActive(){
    let flag = false;
    if(this.data.params.titleType=='1'){
      if(this.data.params.invoiceType == '2'){
        flag = (this.data.errIndexList.length == 0 && !checkIsNull(this.data['params'].title) && !checkIsNull(this.data['params'].taxNo) && !checkIsNull(this.data['params'].telephone) && !checkIsNull(this.data['params'].address) && !checkIsNull(this.data['params'].telephone) && !checkIsNull(this.data['params'].accountBank) && !checkIsNull(this.data['params'].bankNum) && !checkIsNull(this.data['params'].receiveUserName) && !checkIsNull(this.data['params'].receiveUserPhone) && !checkIsNull(this.data['params'].receiveUserAddress) && !checkIsNull(this.data['params'].registerPhone))?true:false;
      }else{
        flag = (this.data.errIndexList.length == 0 && !checkIsNull(this.data['params'].title) && !checkIsNull(this.data['params'].taxNo) && !checkIsNull(this.data['params'].telephone))?true:false;
      }
    }else{
      flag = (this.data.errIndexList.length == 0 && !checkIsNull(this.data['params'].title) && !checkIsNull(this.data['params'].telephone))?true:false;;
    }
    this.setData({ 
      btnActive: flag
    });
  },
  // 放弃申请
  giveUp(){
    wx.showModal({
      title: '系统提示',
      content: '是否放弃当前申请/变更操作？',
      confirmText:'确定',
      confirmColor:'#466FED',
      cancelColor:'#2F2F2F',
      success:(res)=>{
        if (res.confirm) {
          wx.navigateBack();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 发票类型
  chooseInvoiceType(e){
    let type = e.currentTarget.dataset.type;
    let invoiceType = 'params.invoiceType';
    this.reSetParams();
    this.setData({
      [invoiceType]:type
    });
    if(type == '2'){
      let titleType = 'params.titleType';
      this.setData({
        [titleType]:'1'
      })
    }
  },
  // 抬头类型
  chooseHeadType(e){
    let userInfo = wx.getStorageSync('userInfo'); 
    if(this.data.status=='HK')return;
    let type = e.currentTarget.dataset.type; 
    let titleType = 'params.titleType'; 
    let title = 'params.title';
    let taxNo = 'params.taxNo';
    this.reSetParams();
    this.setData({
      [titleType]:type,
      [title]:type==1?userInfo.companyConsumerName:'',
      [taxNo]:type==1?userInfo.taxpayerId:'', 
    })
  },
  // 切换发票类型/抬头类型初始化数据
  reSetParams(){
    let telephone = 'params.telephone';
    let address = 'params.address';
    let receiveUserName = 'params.receiveUserName';
    let receiveUserAddress = 'params.receiveUserAddress';
    let receiveUserPhone = 'params.receiveUserPhone';
    let accountBank = 'params.accountBank';
    let bankNum = 'params.bankNum';
    let registerPhone = 'params.registerPhone';
    this.setData({
      [telephone]:'',
      [address]:'',
      [receiveUserAddress]:'',
      [receiveUserName]:'',
      [receiveUserPhone]:'',
      [accountBank]:'',
      [bankNum]:'',
      [registerPhone]:'',
    });
  },
  // 跳转相应页面
  goPage(e){
    let page =  e.currentTarget.dataset.page;
    if(page == 'invoiceHeaderList'){
      wx.navigateTo({
        url: `/pagesC/invoiceHeaderList/index?invoiceType=${this.data.params.invoiceType}&titleType=${this.data.params.titleType}`,
      })
    }else if(page == 'invoiceSuccess'){
      params={
        source:'4',
        invoiceType:'1',
        titleType:'1',
        title:'',
        taxNo:'',
        telephone:'',
        invoiceAmount:'',
        receiveUserAddress:'',
        receiveUserName:'',
        receiveUserPhone:'',
        accountBank:'',
        bankNum:'',
        deliveryNos:'',
        orderNos:'',
        address:'',
        registerPhone:''
      }
      let params = {};
      if(this.data.params.invoiceType=='2'){
        if(checkIsNull(this.data['params'].title)){
          wx.showToast({
            title: '请选择发票抬头！',
            icon: 'none',
            duration: 3000
          });
          return;
        }
        if(checkIsNull(this.data['params'].taxNo)){
          wx.showToast({
            title: '请输入企业税号！',
            icon: 'none',
            duration: 3000
          });
          return;
        }
        if(checkIsNull(this.data['params'].address)){
          wx.showToast({
            title: '请输入企业注册地址！',
            icon: 'none',
            duration: 3000
          });
          return;
        }
        if(checkIsNull(this.data['params'].registerPhone)){
          wx.showToast({
            title: '请输入企业注册电话！',
            icon: 'none',
            duration: 3000
          });
          return;
        }
        if(checkIsNull(this.data['params'].accountBank)){
          wx.showToast({
            title: '请输入企业开户银行名称！',
            icon: 'none',
            duration: 3000
          });
          return;
        }
        if(checkIsNull(this.data['params'].bankNum)){
          wx.showToast({
            title: '请输入企业开户银行账号！',
            icon: 'none',
            duration: 3000
          });
          return;
        }
        if(checkIsNull(this.data['params'].receiveUserName)){
          wx.showToast({
            title: '请输入纸质专票收件人姓名！',
            icon: 'none',
            duration: 3000
          });
          return;
        }
        if(checkIsNull(this.data['params'].receiveUserPhone)){
          wx.showToast({
            title: '请输入纸质专票收件人电话！',
            icon: 'none',
            duration: 3000
          });
          return;
        }
        if(checkIsNull(this.data['params'].receiveUserAddress)){
          wx.showToast({
            title: '请输入纸质专票收件人地址！',
            icon: 'none',
            duration: 3000
          });
          return;
        }
        params = this.data.params;
      }else{
        if(this.data.params.titleType=='1'){
          if(checkIsNull(this.data['params'].title)){
            wx.showToast({
              title: '请选择发票抬头！',
              icon: 'none',
              duration: 3000
            });
            return;
          }
          if(checkIsNull(this.data['params'].taxNo)){
            wx.showToast({
              title: '请输入企业税号！',
              icon: 'none',
              duration: 3000
            });
            return;
          }
          if(checkIsNull(this.data['params'].telephone)){
            wx.showToast({
              title: '请填写联系电话！',
              icon: 'none',
              duration: 3000
            });
            return;
          }
          params = {
            source:'4',
            invoiceType:this.data.params.invoiceType,
            titleType:this.data.params.titleType,
            title:this.data.params.title,
            taxNo:this.data.params.taxNo,
            deliveryNos:this.data.params.deliveryNos,
            orderNos:this.data.params.orderNos,
            telephone:this.data.params.telephone,
          }
        }else{
          if(checkIsNull(this.data['params'].title)){
            wx.showToast({
              title: '请选择发票抬头！',
              icon: 'none',
              duration: 3000
            });
            return;
          }
          if(checkIsNull(this.data['params'].telephone)){
            wx.showToast({
              title: '请填写联系电话！',
              icon: 'none',
              duration: 3000
            });
            return;
          }
          params = {
            source:'4',
            invoiceType:this.data.params.invoiceType,
            titleType:this.data.params.titleType,
            title:this.data.params.title,
            deliveryNos:this.data.params.deliveryNos,
            orderNos:this.data.params.orderNos,
            telephone:this.data.params.telephone,
          }
        }
      }
      params['deliveryNos']=this.data.params.deliveryNos.split('、').join(',');
      params['orderNos']=this.data.params.orderNos.split('、').join(',');
      if(this.data.status=='CXSQ'){
        params['invoiceNo'] = this.data.invoiceNo;
        getInvoiceUpdate(params).then(res=>{
          if(res.code == 200){
            wx.redirectTo({
              url: '/pagesC/invoiceSuccess/index',
            })
          }
        });
      }
      if(this.data.status=='HK'){
        params['invoiceNo'] = this.data.invoiceNo;
        getInvoiceChange(params).then(res=>{
          if(res.code == 200){
            wx.redirectTo({
              url: '/pagesC/invoiceSuccess/index',
            })
          }
        });
      }
      if(this.data.status=='SQ') {
        getAppInvoice(params).then(res=>{
          if(res.code == 200){
            wx.redirectTo({
              url: '/pagesC/invoiceSuccess/index',
            })
          }
        });
      }
    }
  },
})
