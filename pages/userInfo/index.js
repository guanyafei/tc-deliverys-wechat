let {checkIsHasSpace,checkIsHasSpecialCharacters,checkIsTelNoZone,checkIsHasSpecialCharactersSub,checkSpecialCharactersSub,checkPhone,setIndexList,checkNum,checkIsNull,checkIsTelZone,checkSpecialCharactersAndNoChz} = require('../../utils/util');
let {getAddBook,getEditBook} = require('../../http/index.js');
Page({
  data: {
    userType:0, //0：寄件人； 1：收件人
    tip:'* 温馨提示：按照《邮件快件实名收寄管理办法》要求，您在填写寄件人姓名时需要与您所提供的实名信息一致。',
    showAddress:false, //显示隐藏地址弹窗
    alladders:'',
    zoneFlag:true, // 区号标识 当输入内容满足手机号码校验规则需自动隐藏‘分机号码’字段 
    errIndexList:[],
    sendFlag:'0', // 0:选中  2：取消
    reciverFlag:'1', //1：选中 2：取消
    addressTypeList:[],
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
    signStatus:'0',
    isSaveToAddress:'0',
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
      is_default:'0',
      id:'',
      account_address_type:'', //1:个人结算 2：月结
      btnActive:false,
    }
  },
  onLoad(e) {
    let type = e.userType;
    this.setData({
      userType:type,
     });
     if(type == '0') {
      wx.setNavigationBarTitle({
        title: '寄件人信息'
      });
     }else{
      wx.setNavigationBarTitle({
        title: '收件人信息'
      });
     }
    let userInfo = wx.getStorageSync('userInfo');
    let signStatus = userInfo.consumerSignStatus;
    let user_name = 'params.user_name';
    let address_type = 'params.address_type';
    let account_address_type = 'params.account_address_type';
    this.setData({
      [user_name]:userInfo.userName,
      signStatus:signStatus,
      [address_type]:signStatus=='1'?'1':'0',
      [account_address_type]:userInfo.companySettlementType
    });
    if(e.bookItem) this.setInitData(JSON.parse(decodeURIComponent(e.bookItem)));
  },
  //提交是否激活
  onBtnIsActive(){
    this.setData({
      btnActive:this.data.errIndexList.length == 0 && !checkIsNull(this.data.params.name) && !checkIsNull(this.data.params.phone) && !checkIsNull(this.data.params.book_province) && !checkIsNull(this.data.params.book_address)
    })
  },
  // 设置默认地址
  onSetDefault(){
    this.setData({
      isSaveToAddress:this.data.isSaveToAddress=='1'?'0':'1'
    })
  },
  // 设置响应值
  setInitData(data){
    this.setData({
      sendFlag:data.address_type=='0'?'0':'2',
      reciverFlag:data.address_type=='1'?'1':'2',
    });
    for(let key in data){
        let item = `params.${key}`,val = data[key];
        this.setData({
          [item]:val
        });
    };
    this.data.addersObj = [];
    this.data.addersObj.push({
      firstCode:data.book_province || '',
      firstArea:data.book_province_name || ''
    });
    this.data.addersObj.push({
      firstCode:data.book_city || '',
      firstArea:data.book_city_name || '',
    });
    this.data.addersObj.push({
      firstCode:data.book_district || '',
      firstArea:data.book_district_name || '',
    });
    this.data.addersObj.push({
      firstCode:data.book_street || '',
      firstArea:data.book_street_name || '',
    });
    this.setData({
      zoneFlag:!checkPhone(data.phone),
      addersObj:this.data.addersObj,
      alladders:checkIsNull(data.book_province_name)?'':`${data.book_province_name} ${data.book_city_name} ${data.book_district_name} ${data.book_street_name}`
    });
    this.onBtnIsActive();
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
  // 保存
  save(){
    if(checkIsNull(this.data.params.name)){
      wx.showToast({
        title: '姓名不允许为空！', 
        icon:'none',
        duration: 3000
      });
      return;
    }
    if(checkIsNull(this.data.params.phone)){
      wx.showToast({
        title: '号码不允许为空！',
        icon:'none', 
        duration: 3000
      });
      return;
    }
    if(checkIsNull(this.data.params.book_province)){
      wx.showToast({
        title: this.data.userType=='0'?'请选择寄件地址！':'请选择收件地址！',
        icon:'none',
        duration: 3000
      });
      return;
    } 
    if(checkIsNull(this.data.params.book_address)){
      wx.showToast({
        title: this.data.userType=='0'?'请输入寄件详细地址！':'请输入收件详细地址！',
        icon:'none',
        duration: 3000
      });
      return;
    }
    if(!this.data.btnActive) return;
    // 获取上个页面对象
    let pages = getCurrentPages();
    //获取上一个页面
    let prevPage = pages[pages.length - 2]; 
    let userInfo = {
      bookProvinceName:this.data.params.book_province_name,
      bookProvince:this.data.params.book_province,
      bookCityName:this.data.params.book_city_name,
      bookCity:this.data.params.book_city,
      bookDistrictName:this.data.params.book_district_name,
      bookDistrict:this.data.params.book_district,
      bookStreetName:this.data.params.book_street_name,
      bookStreet:this.data.params.book_street,
      bookAddress:this.data.params.book_address,
      addressType:'0',
      landlineNumber:'',
      phone:this.data.params.phone,
      name:this.data.params.name,
      consumerName:this.data.params.consumer_name,
      userName:this.data.params.user_name,
      accountAddressType:this.data.params.account_address_type, //1:个人结算 2：月结
      id:this.data.params.id || ''
    }
    if(this.data.params.address_type == '0'){
      let consignor='params.consignor',
        consignorPhone='params.consignorPhone',
        consignorCompanyName='params.consignorCompanyName',
        consignorProvince='params.consignorProvince',
        consignorProvinceName='params.consignorProvinceName',
        consignorCity='params.consignorCity',
        consignorCityName='params.consignorCityName',
        consignorDistrict='params.consignorDistrict',
        consignorDistrictName='params.consignorDistrictName',
        consignorStreet='params.consignorStreet',
        consignorStreetName='params.consignorStreetName',
        consignorDetailAddress='params.consignorDetailAddress';
      prevPage.data.sendUserInfo = Object.assign({},prevPage.data.sendUserInfo,userInfo);
      prevPage.setData({
        [consignor]:this.data.params.name,
        [consignorPhone]:this.data.params.phone,
        [consignorCompanyName]:this.data.params.consumer_name,
        [consignorProvince]:this.data.params.book_province,
        [consignorProvinceName]:this.data.params.book_province_name,
        [consignorCity]:this.data.params.book_city,
        [consignorCityName]:this.data.params.book_city_name,
        [consignorDistrict]:this.data.params.book_district,
        [consignorDistrictName]:this.data.params.book_district_name,
        [consignorStreet]:this.data.params.book_street,
        [consignorStreetName]:this.data.params.book_street_name,
        [consignorDetailAddress]:this.data.params.book_address,
      });
      prevPage.getSortingCenterInfo('startSortCenter',this.data.params.book_street);
    }else if(this.data.params.address_type == '1'){
      let consignee='params.consignee',
        consigneePhone='params.consigneePhone',
        consigneeCompanyName='params.consigneeCompanyName',
        consigneeProvince='params.consigneeProvince',
        consigneeProvinceName='params.consigneeProvinceName',
        consigneeCity='params.consigneeCity',
        consigneeCityName='params.consigneeCityName',
        consigneeDistrict='params.consigneeDistrict',
        consigneeDistrictName='params.consigneeDistrictName',
        consigneeStreet='params.consigneeStreet',
        consigneeStreetName='params.consigneeStreetName',
        consigneeDetailAddress='params.consigneeDetailAddress';
      prevPage.data.reciverUserInfo = Object.assign({},prevPage.data.reciverUserInfo,userInfo);
      prevPage.setData({
        [consignee]:this.data.params.name,
        [consigneePhone]:this.data.params.phone,
        [consigneeCompanyName]:this.data.params.consumer_name,
        [consigneeProvince]:this.data.params.book_province,
        [consigneeProvinceName]:this.data.params.book_province_name,
        [consigneeCity]:this.data.params.book_city,
        [consigneeCityName]:this.data.params.book_city_name,
        [consigneeDistrict]:this.data.params.book_district,
        [consigneeDistrictName]:this.data.params.book_district_name,
        [consigneeStreet]:this.data.params.book_street,
        [consigneeStreetName]:this.data.params.book_street_name,
        [consigneeDetailAddress]:this.data.params.book_address,
        reciverUserInfo:prevPage.data.reciverUserInfo
      });
      prevPage.getSortingCenterInfo('endSortCenter',this.data.params.book_street);
    }
    prevPage.onBtnIsActive();
    let is_default = "params.is_default";
    if(this.data.isSaveToAddress == '0'){
       this.setData({
         [is_default]:'0'
       })
    }else{
      this.setData({
        [is_default]:'1'
      })
    }
    if(this.data.isSaveToAddress == '1'){
      if(this.data.params.id !=''){
        getEditBook(this.data.params).then(res=>{
          if(res.code = 200){
            prevPage.getEstimateCost();
            prevPage.getFreightList();
            wx.navigateBack();
          }
        });
      }else{
        getAddBook(this.data.params).then(res=>{
          if(res.code == 200){
            prevPage.getEstimateCost();
            prevPage.getFreightList();
            wx.navigateBack();
          }
        });
      }
    }else{
      prevPage.getEstimateCost();
      prevPage.getFreightList();
      wx.navigateBack();
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
      isSaveToAddress:'0',
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
