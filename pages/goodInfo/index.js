let {checkIsHasSpace,checkIsHasSpecialCharacters,checkIsTelNoZone,checkIsHasSpecialCharactersSub,checkSpecialCharactersSub,checkPhone,setIndexList,checkNum,checkIsNull,checkIsTelZone,checkSpecialCharactersAndNoChz} = require('../../utils/util');
let {getAddBook,getEditBook } = require('../../http/index.js');
Page({
  data: {
    showAddress:false, //显示隐藏地址弹窗
    alladders:'',
    zoneFlag:true, // 区号标识 当输入内容满足手机号码校验规则需自动隐藏‘分机号码’字段 
    errIndexList:[],
    sendFlag:'0', // 0:选中  2：取消
    reciverFlag:'1', //1：选中 2：取消
    addressTypeList:[],
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
      }],
    signStatus:'0',
    btnActive:false,
    params:{
      book_province_name:'',
      book_province:'',
      book_city_name:'',
      book_city:'',
      book_district_name:'',
      book_district:'',
      book_street_name:'',
      book_street:'',
      book_address:'',
      address_type:'0',
      landline_number:'',
      phone:'',
      name:'',
      consumer_name:'',
      user_name:'',
      is_default:'1',
      account_address_type:'' //1:个人结算 2：月结
    },
    mgeType:'0',
    addressType:'-1',
    showPicker:false
  },
  onLoad(e) {
    let userInfo = wx.getStorageSync('userInfo');
    let signStatus = userInfo.consumerSignStatus || '0';
    let user_name = 'params.user_name';
    let address_type = 'params.address_type';
    let account_address_type = 'params.account_address_type';
    this.setData({
      [user_name]:userInfo.userName,
      signStatus:signStatus,
      [address_type]:signStatus=='1'?'1':'0,1',
      [account_address_type]:userInfo.companySettlementType
    });
    if(!checkIsNull(e.type)) this.setData({mgeType:'1'})
    if(e.bookItem) {this.setInitData(JSON.parse(e.bookItem))}
  },
   //显示日期组件
   getTimerPicker(){
    this.setData({
      showPicker:true,
    })
  },
   // 保存时间
   savetimer(e){
      this.setData({
        showPicker:false,
      })
   },
   // 取消时间选择
   cancleTimer(e){
     this.setData({
       showPicker:false,
     })
   },
  // 设置默认地址
  onSetDefault(){
    if(this.data.mgeType=='1') return;
    let isDefault = "params.is_default";
    this.setData({
      [isDefault]:this.data.params.is_default=='1'?'0':'1'
    })
  },
  // 设置响应值
  setInitData(data){
    this.setData({
      sendFlag:data.address_type=='0'?'0':'2',
      reciverFlag:data.address_type=='1'?'1':'2',
      addressType:data.address_type
    });
    for(let key in data){
        let item = `params.${key}`,val = data[key];
        this.setData({
          [item]:val
        });
    };
    this.data.addersObj = [];
    this.data.addersObj.push({
      firstCode:data.book_province,
      firstArea:data.book_province_name
    });
    this.data.addersObj.push({
      firstCode:data.book_city,
      firstArea:data.book_city_name
    });
    this.data.addersObj.push({
      firstCode:data.book_district,
      firstArea:data.book_district_name
    });
    this.data.addersObj.push({
      firstCode:data.book_street,
      firstArea:data.book_street_name
    });
    this.setData({
      zoneFlag:!checkPhone(data.phone),
      addersObj:this.data.addersObj,
      alladders:`${data.book_province_name} ${data.book_city_name} ${data.book_district_name} ${data.book_street_name}`
    });
    this.onBtnIsActive();
  },
   // 保存到寄件人
  onSaveToSend(){
    let temp = this.data.sendFlag=='0'?'2':'0';
    if(this.data.mgeType=='1'){
      return
    }
    if(temp=='2'&&this.data.reciverFlag=='2'){
      return;
    }
    this.setData({
      sendFlag:temp,
    });
    this.setUserType();
  },
  // 保存到收件人
  onSaveToReciver(e){
    // 签约用户只能添加收件人
    if(this.data.mgeType=='1'){
      return
    }
    if(this.data.signStatus=='1'){
      let address_type = 'params.address_type';
      this.setData({
        [address_type]:'1'
      });
      return;
    };
    let temp = this.data.reciverFlag=='1'?'2':'1';
    if(temp=='2'&&this.data.sendFlag=='2'){
      return;
    }
    this.setData({
      reciverFlag:temp
    });
    this.setUserType();
  },
  // 设置联系人类型
  setUserType(){
    let address_type = 'params.address_type';
    if(this.data.reciverFlag == '1'&&this.data.sendFlag=='0'){
      this.setData({
        [address_type]:'0,1'
      });
    }else if(this.data.reciverFlag == '1'&&this.data.sendFlag=='2'){
      this.setData({
        [address_type]:'1'
      });
    }else if(this.data.reciverFlag == '2'&&this.data.sendFlag=='0'){
      this.setData({
        [address_type]:'0'
      });
    }
  },
  //提交是否激活
  onBtnIsActive(){
    this.setData({
      btnActive:this.data.errIndexList.length == 0 && !checkIsNull(this.data.params.name) && !checkIsNull(this.data.params.phone) && !checkIsNull(this.data.params.book_province) && !checkIsNull(this.data.params.book_address)
    })
  },
  // 保存
  save(){
    wx.navigateBack();
    return
    if(checkIsNull(this.data.params.name)){
      wx.showToast({
        title: '姓名不允许为空！', 
        icon:'none',
        duration: 3000
      });
      return;
    }
    if(this.data.params.id){
      // 修改
      getEditBook(this.data.params).then(res=>{
        if(res.code == 200){
          wx.navigateBack();
        }
      })
    }else{
      // 新增
      getAddBook(this.data.params).then(res=>{
        if(res.code == 200){
          wx.navigateBack();
        }
      });
    }
  },
  // 获取地址
  getAddress(e){
    let params = e.detail.params;
    let book_province_name = 'params.book_province_name';
    let book_province = 'params.book_province';
    let book_city_name = 'params.book_city_name';
    let book_city = 'params.book_city';
    let book_district_name = 'params.book_district_name';
    let book_district = 'params.book_district';
    let book_street_name = 'params.book_street_name';
    let book_street = 'params.book_street';
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
    });
    this.onBtnIsActive();
  },
  // 显示地址弹框
  showAddress(e){
    if(this.data.mgeType=='1') return;
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
  // 校验
  getCheck(e){
    let index = e.currentTarget.dataset.index,val = e.detail.value;
    if(index == 1){
      // 姓名
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharacters(val);
      val = checkSpecialCharactersSub(val);
      let item = 'params.name';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
    }else if(index == 2){
      // 电话或手机号
      let reciverPhoneFlag = checkPhone(val),telFlag = checkIsTelNoZone(val);
      val = checkNum(val);
      let item = 'params.phone';
      let landline_number = 'params.landline_number';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,!(reciverPhoneFlag || telFlag)),
        zoneFlag:!reciverPhoneFlag,
        [landline_number]:!reciverPhoneFlag?this.data.params.landline_number:''
      })
    }else if(index == 3){
      // 区号
      let zoneFlag = checkIsTelZone(val);
      val = checkNum(val);
      let item = 'params.landline_number';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,'2',!zoneFlag)
      })
    }else if(index == 5){
      // 详细地址
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharactersSub(val);
      val = checkSpecialCharactersSub(val);
      let item = 'params.book_address';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
    }else if(index == 6){
      // 公司名称
      let spaceFlag = checkIsHasSpace(val),specialCharactersFlag = checkIsHasSpecialCharacters(val);
      val = checkSpecialCharactersAndNoChz(val);
      let item = 'params.consumer_name';
      this.setData({
        [item]:val,
        errIndexList: setIndexList(this.data.errIndexList,index,spaceFlag || specialCharactersFlag)
      })
    }
    this.onBtnIsActive();
  },
  // 重置
  clear(){
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      alladders:'',
      zoneFlag:true, 
      errIndexList:[],
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
      sendFlag:'0', // 0:选中  2：取消
      reciverFlag:'1', //1：选中 2：取消
      params:{
        book_province_name:'',
        book_province:'',
        book_city_name:'',
        book_city:'',
        book_district_name:'',
        book_district:'',
        book_street_name:'',
        book_street:'',
        book_address:'',
        address_type:this.data.signStatus=='1'?'1':'0',
        landline_number:'',
        phone:'',
        name:'',
        consumer_name:'',
        user_name:'',
        is_default:'1',
        account_address_type:userInfo.companySettlementType //1:个人结算 2：月结  
      }
    });
    this.onBtnIsActive();
  },
})
