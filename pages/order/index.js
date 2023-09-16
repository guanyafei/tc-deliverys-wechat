let { getBookList, getDeliveryTime, getFreight, getForecast, getProductLTRatio, createOrder, operationRecord, getSortingCenterInfo, getOrderDetailsInfo } = require('../../http/index.js');
let { formatFreightTime, checkIsNull, accAdd, accMul } = require('../../utils/util');
Page({
    data: {
        selected: false,

        notifyToast:false,
        // totalBillWeight:0,
        waybillNo:'',
        orderType:'xd',//xd:新单 zlyd：再来一单  bj:编辑
        showPicker: false,
        showPayType: false,
        showSpendDetail: false,
        onSelectTerms: true, 
        alladders: '',
        standardDesc: '', //物品信息描述
        addedValuedDesc: '', // 增值服务描述
        payTypeDesc: '', // 结算方式描述
        bjfwDesc: '声明物品价值并保价', // 结算方式描述
        timeList: [],
        payTypeSelectIndex: -1,
        signStatus: '',
        expectCollectTime: '',
        pkPrice: 0, //包装费
        ipPrice: 0, //保价费
        srPrice: 0, //签单返还费用
        spendDetail: {}, //明细
        additionalWeight:'',
        additionalWeightPrice:'',
        firstWeight:'',
        firstWeightPrice:'',
        productLTRatio: 0,
        params: {
            height: '',//总高
            length: '',//总长
            width: '',//总宽
            totalWeight:'', //总重量
            totalVolume:'', //总体积
            totalWeightVolume:'', //总体积重量
            billWeight:0, //计费总重量
            consignorCustomerAccount: '',
            consigneeCustomerAccount: '',
            customerType: '1',
            channel: '4',
            businessType: 1,
            collectMode: '1',
            deliveryMode: '1',
            orderType: '1',
            signType: '0',
            transportType: '1',
            servicePrice: '',
            sumPrice: '',
            consignorCustomerCode: '',
            consignorCustomerType:'',
            consignorCustomerName: '',
            collectSite: '',
            collectSiteName: '',
            collectSiteDc: '',
            startSortCenter: '',
            startSortCenterName: '',
            deliverySite: '',
            deliverySiteName: '',
            endSortCenter: '',
            endSortCenterName: '',
            consignor: '',
            consignorPhone: '',
            consignorCompanyName: '',
            consignorProvince: '',
            consignorProvinceName: '',
            consignorCity: '',
            consignorCityName: '',
            consignorDistrict: '',
            consignorDistrictName: '',
            consignorStreet: '',
            consignorStreetName: '',
            consignorDetailAddress: '',
            consignee: '',
            consigneePhone: '',
            consigneeCompanyName: '',
            consigneeProvince: '',
            consigneeProvinceName: '',
            consigneeCity: '',
            consigneeCityName: '',
            consigneeDistrict: '',
            consigneeDistrictName: '',
            consigneeStreet: '',
            consigneeStreetName: '',
            consigneeDetailAddress: '',
            consigneeCustomerCode:'',
            consigneeCustomerType:'',
            expectCollectTime: '',
            expectArriveTime: '',
            totalNum: '',
            tmsImageInfos: [], // 图片列表
            customerRemark: '',
            orderServiceDetailVo: [],
            goodsName: '',
            settlementType: '',
            serviceProduct: '',
            offlineSignRemark: '',
            baseFreigt: '',
            // estimateFreight:'',
            baseFreigtDiscount: '',
            expsPackageInfo: [{
                height: '',
                length: '',
                width: '',
                weight: '',
                volume: '',
                volumeWeight:'', 
                billWeight: ''
            }]
        },
        sendUserInfo: {
            account_address_type: '',
        },
        reciverUserInfo: {
            account_address_type: '',
        },
        btnActive: false
    },
    onLoad(e) {
        let userInfo = wx.getStorageSync('userInfo');
        let sendAddressType = 'sendUserInfo.account_address_type';
        let reciverAddressType = 'reciverUserInfo.account_address_type';
        let consignorCustomerCode = 'params.consignorCustomerCode';
        let consignorCustomerName = 'params.consignorCustomerName';
        let consignorCustomerAccount = 'params.consignorCustomerAccount';
        let consignorCustomerType = 'params.consignorCustomerType';
        this.setData({
            signStatus: userInfo.consumerSignStatus,
            [sendAddressType]: userInfo.companySettlementType,
            [reciverAddressType]: userInfo.companySettlementType,
            [consignorCustomerAccount]: userInfo.userName,
        });
        // 详情
        let id = e.orderNo || '';
        let orderType = e.type || this.data.orderType;
        this.setData({
            orderType:orderType
        });
        if (!checkIsNull(id)) {
            this.onGetDetail(id);
            return;
        }
        if (this.data.signStatus == '1') {
            this.setData({
                [consignorCustomerCode]: userInfo.balanceLoginNo,
                [consignorCustomerName]: userInfo.balanceConsumerName,
                [consignorCustomerType]:'1'
            });
        }else{
            this.setData({
                [consignorCustomerType]:''
            });
        }
        let params = {
            user_name: userInfo.userName,
            pageSize: 100,
            pageNum: 1,
        };
        getBookList(params).then(res => {
            if (res.code == 200) {
                res.data.rows.map(item => {
                    //  寄件人
                    if (item.addressType == '0' && item.isDefault == '1') {
                        let consignor = 'params.consignor',
                            consignorPhone = 'params.consignorPhone',
                            consignorCompanyName = 'params.consignorCompanyName',
                            consignorProvince = 'params.consignorProvince',
                            consignorProvinceName = 'params.consignorProvinceName',
                            consignorCity = 'params.consignorCity',
                            consignorCityName = 'params.consignorCityName',
                            consignorDistrict = 'params.consignorDistrict',
                            consignorDistrictName = 'params.consignorDistrictName',
                            consignorStreet = 'params.consignorStreet',
                            consignorStreetName = 'params.consignorStreetName',
                            consignorDetailAddress = 'params.consignorDetailAddress';
                        this.setData({
                            [consignor]: item.name,
                            [consignorPhone]: item.phone,
                            [consignorCompanyName]: item.consumerName,
                            [consignorProvince]: item.bookProvince,
                            [consignorProvinceName]: item.bookProvinceName,
                            [consignorCity]: item.bookCity,
                            [consignorCityName]: item.bookCityName,
                            [consignorDistrict]: item.bookDistrict,
                            [consignorDistrictName]: item.bookDistrictName,
                            [consignorStreet]: item.bookStreet,
                            [consignorStreetName]: item.bookStreetName,
                            [consignorDetailAddress]: item.bookAddress
                        });
                        this.data.sendUserInfo = Object.assign({}, this.data.sendUserInfo, item);
                        this.getSortingCenterInfo('startSortCenter', item.bookStreet);
                    }
                    //  收件人
                    if (item.addressType == '1' && item.isDefault == '1') {
                        let consignee = 'params.consignee',
                            consigneePhone = 'params.consigneePhone',
                            consigneeCompanyName = 'params.consigneeCompanyName',
                            consigneeProvince = 'params.consigneeProvince',
                            consigneeProvinceName = 'params.consigneeProvinceName',
                            consigneeCity = 'params.consigneeCity',
                            consigneeCityName = 'params.consigneeCityName',
                            consigneeDistrict = 'params.consigneeDistrict',
                            consigneeDistrictName = 'params.consigneeDistrictName',
                            consigneeStreet = 'params.consigneeStreet',
                            consigneeStreetName = 'params.consigneeStreetName',
                            consigneeDetailAddress = 'params.consigneeDetailAddress';
                        this.setData({
                            [consignee]: item.name,
                            [consigneePhone]: item.phone,
                            [consigneeCompanyName]: item.consumerName,
                            [consigneeProvince]: item.bookProvince,
                            [consigneeProvinceName]: item.bookProvinceName,
                            [consigneeCity]: item.bookCity,
                            [consigneeCityName]: item.bookCityName,
                            [consigneeDistrict]: item.bookDistrict,
                            [consigneeDistrictName]: item.bookDistrictName,
                            [consigneeStreet]: item.bookStreet,
                            [consigneeStreetName]: item.bookStreetName,
                            [consigneeDetailAddress]: item.bookAddress,
                        });
                        this.data.reciverUserInfo = Object.assign({}, this.data.reciverUserInfo, item);
                        this.getSortingCenterInfo('endSortCenter', item.bookStreet);
                    }
                });
                if (this.data.params.consignorStreet != '') {
                    getDeliveryTime(this.data.params.consignorStreet).then(res => {
                        if (res.code == 200) {
                            let orderExpectCollectTime = 'params.expectCollectTime';
                            this.setData({
                                expectCollectTime: res.data.todayTimes.length > 0 ? `今天${res.data.todayTimes[0]}` : `明天${res.data.tomorrowTimes[0]}`,
                                [orderExpectCollectTime]: res.data.todayTimes.length > 0 ? `${res.data.todayTimes[0]}` : `${formatFreightTime(1)} ${res.data.tomorrowTimes[0]}`,
                            });
                            this.getFreightList();
                        }else if(res.code == 201){
                            let orderExpectCollectTime = 'params.expectCollectTime';
                            let expectArriveTime = 'params.expectArriveTime';
                            let serviceProduct = 'params.serviceProduct';
                            let baseFreigt = "params.baseFreigt";
                            let baseFreigtDiscount = "params.baseFreigtDiscount";
                            wx.showToast({
                                title: res.msg,
                                icon:'none',
                                duration: 3000
                              });
                              this.setData({
                                  [orderExpectCollectTime]:'',
                                  expectCollectTime:'',
                                  timeList: [],
                                  payTypeSelectIndex: -1,
                                  [expectArriveTime]: '',
                                  [serviceProduct]: '',
                                  [baseFreigt]:'',
                                  [baseFreigtDiscount]:'',
                              });
                              this.onBtnIsActive();
                              this.onCalculate();
                        }
                    });
                }
            }
        });
        getProductLTRatio().then(res => {
            if (res.code == 200) {
                this.setData({
                    productLTRatio: res.data.msg
                })
            }
        });
    },
    //提交是否激活
    onBtnIsActive() {
        this.setData({
            btnActive: !checkIsNull(this.data.params.consignor) && !checkIsNull(this.data.params.consignee) && !checkIsNull(this.data.params.expectCollectTime) && !checkIsNull(this.data.params.goodsName) && !checkIsNull(this.data.params.settlementType) && !checkIsNull(this.data.params.serviceProduct)
        })
    },
    // 获取站点详细信息
    getSortingCenterInfo(sortCenter, code) {
        if (!checkIsNull(code)) {
            getSortingCenterInfo(code).then(res => {
                if (res.code == 200) {
                    if (sortCenter == 'startSortCenter') {
                        let collectSiteDc = 'params.collectSiteDc';
                        let collectSite = 'params.collectSite';
                        let collectSiteName = 'params.collectSiteName';
                        let startSortCenter = 'params.startSortCenter';
                        let startSortCenterName = 'params.startSortCenterName';
                        let orderExpectCollectTime = 'params.expectCollectTime';
                        if(checkIsNull(res.data)){
                            wx.showToast({
                                title: res.msg,
                                icon:'none',
                                duration: 3000
                            });
                            this.setData({
                                [collectSiteDc]:'',
                                [collectSite]: '',
                                [collectSiteName]: '',
                                [startSortCenter]: '',
                                [startSortCenterName]: '',
                                [orderExpectCollectTime]:'',
                                expectCollectTime:''
                            });
                        }else{
                            this.setData({
                                [collectSiteDc]: res.data.belongDc,
                                [collectSite]: res.data.siteCode,
                                [collectSiteName]: res.data.siteName,
                                [startSortCenter]: res.data.sortingCode,
                                [startSortCenterName]: res.data.sortingName,
                            });
                            this.getDeliveryTime();
                        }
                    } else {
                        let deliverySite = 'params.deliverySite';
                        let deliverySiteName = 'params.deliverySiteName';
                        let endSortCenter = 'params.endSortCenter';
                        let endSortCenterName = 'params.endSortCenterName';
                        if(checkIsNull(res.data)){
                            wx.showToast({
                                title: res.msg,
                                icon:'none',
                                duration: 3000
                            });
                            this.setData({
                                [deliverySite]: '',
                                [deliverySiteName]: '',
                                [endSortCenter]: '',
                                [endSortCenterName]: '',
                            })
                        }else{
                            this.setData({
                                [deliverySite]: res.data.siteCode,
                                [deliverySiteName]: res.data.siteName,
                                [endSortCenter]: res.data.sortingCode,
                                [endSortCenterName]: res.data.sortingName,
                            })
                        }
                    }
                    if(!checkIsNull(this.data.params.startSortCenter)&&!checkIsNull(this.data.params.endSortCenter)&&this.data.params.startSortCenter !== this.data.params.endSortCenter){
                        this.setData({
                           notifyToast: true
                        });
                        let timer = setTimeout(() => {
                        clearTimeout(timer);
                        this.setData({
                            notifyToast: false
                        });
                        }, 3000);
                    }
                }
            });
        }
    },
    // 获取期望取货时间
    getDeliveryTime(){
        getDeliveryTime(this.data.params.consignorStreet).then(res => {
            if (res.code == 200) {
                let orderExpectCollectTime = 'params.expectCollectTime';
                this.setData({
                    expectCollectTime: res.data.todayTimes.length > 0 ? `今天${res.data.todayTimes[0]}` : `明天${res.data.tomorrowTimes[0]}`,
                    [orderExpectCollectTime]: res.data.todayTimes.length > 0 ? `${res.data.todayTimes[0]}` : `${formatFreightTime(1)} ${res.data.tomorrowTimes[0]}`,
                });
                this.getFreightList();
            }else if(res.code == 201){
                let orderExpectCollectTime = 'params.expectCollectTime';
                let expectArriveTime = 'params.expectArriveTime';
                let serviceProduct = 'params.serviceProduct';
                let baseFreigt = "params.baseFreigt";
                let baseFreigtDiscount = "params.baseFreigtDiscount";
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration: 3000
                  });
                  this.setData({
                      [orderExpectCollectTime]:'',
                      expectCollectTime:'',
                      timeList: [],
                      payTypeSelectIndex: -1,
                      [expectArriveTime]: '',
                      [serviceProduct]: '',
                      [baseFreigt]:'',
                      [baseFreigtDiscount]:'',
                  });
                  this.onBtnIsActive();
                  this.onCalculate();
            }
        });
    },
    // 订单更新
    onGetDetail(id) {
        getOrderDetailsInfo(id).then(res => {
            if (res.code == 200) {
                let desc = '',
                    arr = [],
                    addedValuedStr = [];
                // 增值服务描述
                let addedValuedList = res.data.orderServiceDetailVo;
                for (let i = 0; i < addedValuedList.length; i++) {
                    if (addedValuedList[i].serviceCode == 'PK') {
                        for (let j = 0; j < addedValuedList[i].details.length; j++) {
                            desc = `${addedValuedList[i].details[j].serviceName} 数量：${addedValuedList[i].details[j].serviceNum}`;
                            arr.push(desc);
                            addedValuedStr.push(`${addedValuedList[i].details[j].serviceName}x${addedValuedList[i].details[j].serviceNum} ¥${addedValuedList[i].details[j].serviceCharge}*${addedValuedList[i].details[j].serviceNum}`);
                        }
                    }else if(addedValuedList[i].serviceCode == 'IP'){
                        this.setData({
                            bjfwDesc:`自定义物品价值${addedValuedList[i].serviceCharge}元`
                        })
                    }
                }
                // 物品信息描述
                let standardStr = '',packList=[],
                expsPackageInfoList = res.data.expsPackageInfo;
                // if (expsPackageInfoList.length > 0) {
                //     standardStr += `${expsPackageInfoList.length}件 | `
                // }
                // if (!checkIsNull(expsPackageInfoList[0].width) && expsPackageInfoList[0].width > 0) {
                //     standardStr += `${expsPackageInfoList[0].length}*${expsPackageInfoList[0].width}*${expsPackageInfoList[0].height} | `
                // }
                // if (!checkIsNull(expsPackageInfoList[0].volume) && expsPackageInfoList[0].volume > 0) {
                //     standardStr += `${expsPackageInfoList[0].volume}m³`
                // }
                if (!checkIsNull(res.data.totalNum) && res.data.totalNum > 0) {
                  standardStr += `${res.data.totalNum}件 | `
                }
                if (!checkIsNull(res.data.width) && res.data.width > 0) {
                  standardStr += `${res.data['length']}*${res.data.width}*${res.data.height} | `
                }
                if (!checkIsNull(res.data.totalVolume) && res.data.totalVolume > 0) {
                    standardStr += `${res.data.totalVolume}m³`
                }
                let userInfo = wx.getStorageSync('userInfo');
                let settlementType = userInfo.companySettlementType;
                let payType = {
                        '1': '寄付月结',
                        '2': '寄付现结',
                        '3': '到付现结'
                    },
                    payTypeDesc = '';
                if (settlementType == '0' && res.data.settlementType == '1') {
                    let companyMonthlyInvoicing = userInfo.companyMonthlyInvoicing;
                    payTypeDesc = `${payType[res.data.settlementType]} (${companyMonthlyInvoicing})`
                } else {
                    payTypeDesc = `${payType[res.data.settlementType]}`
                }
                // 寄件
                this.data.sendUserInfo = Object.assign({}, this.data.sendUserInfo, {
                    name: res.data.consignor,
                    phone: res.data.consignorPhone,
                    consumerName: res.data.consignorCompanyName,
                    bookProvince: res.data.consignorProvince,
                    bookProvinceName: res.data.consignorProvinceName,
                    bookCity: res.data.consignorCity,
                    bookCityName: res.data.consignorCityName,
                    bookDistrict: res.data.consignorDistrict,
                    bookDistrictName: res.data.consignorDistrictName,
                    bookStreet: res.data.consignorStreet,
                    bookStreetName: res.data.consignorStreetName,
                    bookAddress: res.data.consignorDetailAddress
                });
                // 收件
                this.data.reciverUserInfo = Object.assign({}, this.data.reciverUserInfo, {
                    name: res.data.consignee,
                    phone: res.data.consigneePhone,
                    consumerName: res.data.consigneeCompanyName,
                    bookProvince: res.data.consigneeProvince,
                    bookProvinceName: res.data.consigneeProvinceName,
                    bookCity: res.data.consigneeCity,
                    bookCityName: res.data.consigneeCityName,
                    bookDistrict: res.data.consigneeDistrict,
                    bookDistrictName: res.data.consigneeDistrictName,
                    bookStreet: res.data.consigneeStreet,
                    bookStreetName: res.data.consigneeStreetName,
                    bookAddress: res.data.consigneeDetailAddress
                });
                // for(let i = 0;i<res.data.expsPackageInfo.length;i++){
                //     this.data.totalBillWeight = accAdd(this.data.totalBillWeight,res.data.expsPackageInfo[i].billWeight);
                // }
                for (let key in this.data.params) {
                    let item = `params.${key}`;
                    this.setData({
                        [item]: res.data[key]
                    })
                }
                expsPackageInfoList.length>0 && expsPackageInfoList.map(item=>{
                    packList.push({
                        billWeight:0,
                        volumeWeight:0,
                        height:0,
                        length:0,
                        width:0,
                        weight:0,
                        volume:0,
                    });
                });   
                this.data.params.expsPackageInfo = packList;
                this.data.params['pieceId'] = res.data.pieceId || '';
                if(standardStr.substr(standardStr.length-3,standardStr.length)==" | "){
                    standardStr=standardStr.substr(0,standardStr.length-3);
                }
                this.setData({ 
                    addedValuedDesc: addedValuedStr.join(' | '),
                    standardDesc: standardStr,
                    payTypeDesc: payTypeDesc,
                });
                this.data.params['waybillNo'] = res.data.waybillNo;
                if(this.data.orderType == 'bj'){
                    this.data.params['orderNo'] = id;
                    this.data.waybillNo = res.data.waybillNo;
                    if(this.data.params.expectCollectTime.indexOf('小时')>-1){
                        this.setData({
                            expectCollectTime: `今日${this.data.params.expectCollectTime}`,
                        });
                    }else{
                        let timerList = this.data.params.expectCollectTime.split(' ');
                        if(timerList[0] == formatFreightTime(0)){
                            this.setData({
                                expectCollectTime: `今天${timerList.length>2?timerList[2]:timerList[1]}`,
                              });
                        }else if(timerList[0] == formatFreightTime(1)){
                          this.setData({
                            expectCollectTime: `明天${timerList.length>2?timerList[2]:timerList[1]}`,
                          });
                        }else if(timerList[0] == formatFreightTime(2)){
                          this.setData({
                            expectCollectTime: `后天${timerList.length>2?timerList[2]:timerList[1]}`,
                          });
                        }
                    }
                    this.getEstimateCost();
                    this.getFreightList();
                }else{
                    delete this.data.params.waybillNo;
                    delete this.data.params.pieceId; 
                    let serviceProduct = "params.serviceProduct";
                    let baseFreigt = "params.baseFreigt";
                    let baseFreigtDiscount = "params.baseFreigtDiscount";
                    this.setData({
                        [serviceProduct]:'',
                        [baseFreigt]:'',
                        [baseFreigtDiscount]:'',
                    });
                    getDeliveryTime(this.data.params.consignorStreet).then(res => {
                        if (res.code == 200) {
                            let orderExpectCollectTime = 'params.expectCollectTime';
                            this.setData({
                                expectCollectTime: res.data.todayTimes.length > 0 ? `今天${res.data.todayTimes[0]}` : `明天${res.data.tomorrowTimes[0]}`,
                                [orderExpectCollectTime]: res.data.todayTimes.length > 0 ? `${res.data.todayTimes[0]}` : `${formatFreightTime(1)} ${res.data.tomorrowTimes[0]}`,
                            });
                            this.getFreightList();
                            this.onBtnIsActive();
                        }else if(res.code == 201){
                            let orderExpectCollectTime = 'params.expectCollectTime';
                            let expectArriveTime = 'params.expectArriveTime';
                            let serviceProduct = 'params.serviceProduct';
                            let baseFreigt = "params.baseFreigt";
                            let baseFreigtDiscount = "params.baseFreigtDiscount";
                            wx.showToast({
                                title: res.msg,
                                icon:'none',
                                duration: 3000
                              });
                              this.setData({
                                  [orderExpectCollectTime]:'',
                                  expectCollectTime:'',
                                  timeList: [],
                                  payTypeSelectIndex: -1,
                                  [expectArriveTime]: '',
                                  [serviceProduct]: '',
                                  [baseFreigt]:'',
                                  [baseFreigtDiscount]:'',
                              });
                              this.onBtnIsActive();
                              this.onCalculate();
                        }
                    });
                }
                this.onCalculate();
                this.onBtnIsActive();
            }
        });
        return;
    },
    // 选中电子条款
    onSelectTerms() {
        this.setData({
            onSelectTerms: !this.data.onSelectTerms
        })
    },
    // 预估运费
    getEstimateCost() {
        let userInfo = wx.getStorageSync('userInfo');
        if (checkIsNull(this.data.params.consigneeCity) || checkIsNull(this.data.params.consignorCity) || checkIsNull(this.data.params.serviceProduct)) {
            return;
        }
        let params = {
            billWeight: this.data.params.billWeight,
            consigneeCity: this.data.params.consigneeCity,
            consignorCity: this.data.params.consignorCity,
            consignorCustomerCode: userInfo.balanceLoginNo,
            serviceProduct: this.data.params.serviceProduct,
            type: '2',
        };
        getForecast(params).then(res => { 
            if (res.code == 200) {
                let baseFreigt = 'params.baseFreigt';
                let baseFreigtDiscount = 'params.baseFreigtDiscount';
                this.setData({
                    [baseFreigt]: res.data.baseFreigt,
                    [baseFreigtDiscount]: res.data.baseFreigtDiscount || '',
                    additionalWeight:res.data.additionalWeight || '',
                    additionalWeightPrice:res.data.additionalWeightPrice || '',
                    firstWeight:res.data.firstWeight || '',
                    firstWeightPrice:res.data.firstWeightPrice || '',
                });
                this.onCalculate();
            }
        });
    },
    // 运费时效查询
    getFreightList() {
        if (!checkIsNull(this.data.params.consignorCity) && !checkIsNull(this.data.params.consigneeStreet) && !checkIsNull(this.data.params.consigneeCity) && !checkIsNull(this.data.params.consigneeStreet) && !checkIsNull(this.data.params.expectCollectTime) && !checkIsNull(this.data.params.billWeight)) {
            let params = {
                delivery_city_code: this.data.params.consignorCity,
                delivery_street_code: this.data.params.consignorStreet,
                dest_city_code: this.data.params.consigneeCity,
                dest_street_code: this.data.params.consigneeStreet,
                delivery_time: this.data.params.expectCollectTime,
                weight: this.data.params.billWeight,
                volume: ''
            }
            this.setData({
                timeList: [],
                payTypeSelectIndex: -1,
            });
            this.onBtnIsActive();
            getFreight(params).then(res => {
                if (res.code == 200) {
                    if(checkIsNull(res.data)){
                        wx.showToast({
                            title: res.msg,
                            icon:'none',
                            duration: 3000
                          })
                    }else{
                        this.setFreightDesc(res.data);
                    }
                } else if (res.code == 201) {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none' ,
                        duration: 3000
                    });
                }
            });
        }
    },
    // 设置预计送达时间描述
    setFreightDesc(list = []) {
        let index = -1,
            expectArriveTimeStr = '',
            serviceProductStr = '';
        for (let i = 0; i < list.length; i++) {
            let time = list[i].estimatedAging.substr(-5, 5);
            let day = list[i].estimatedAging.substr(8, 2);
            list[i].desc = day+'日' + time + '前送达';
            if (!checkIsNull(this.data.params.serviceProduct) && list[i].productCode == this.data.params.serviceProduct) {
                index = i;
                expectArriveTimeStr = list[i].estimatedAging;
                serviceProductStr = list[i].productCode;
            }
        }
        let expectArriveTime = 'params.expectArriveTime';
        let serviceProduct = 'params.serviceProduct';
        this.setData({
            timeList: list,
            payTypeSelectIndex: index,
            [expectArriveTime]: expectArriveTimeStr,
            [serviceProduct]: serviceProductStr,
        });
        this.onBtnIsActive();
    },
    // 预计送达时间选择
    selectItem(e) {
        let index = e.currentTarget.dataset.index;
        let item = this.data.timeList[index];
        let expectArriveTime = 'params.expectArriveTime';
        let serviceProduct = 'params.serviceProduct';
        this.setData({
            payTypeSelectIndex: index,
            [expectArriveTime]: item.estimatedAging,
            [serviceProduct]: item.productCode,
        });
        this.getEstimateCost();
        this.onBtnIsActive();
    },
    // 获取支付方式
    getPayType(e) {
        let payType = e.detail.params;
        let payTypeDesc = e.detail.payTypeDesc;
        let settlementType = 'params.settlementType';
        this.setData({
            showPayType: false,
            payTypeDesc: payTypeDesc,
            [settlementType]: Number(payType)
        });
        this.onBtnIsActive();
    },
    //显示日期组件
    getTimerPicker() {
        this.setData({
            showPicker: true,
        })
    },
    // 保存时间
    savetimer(e) {
        let obj = {
            '0': '今天',
            '1': '明天',
            '2': '后天'
        }
        let timer = `${obj[e.detail.dayIndex+'']}${e.detail.selectTime}`;
        let expectCollectTime = 'params.expectCollectTime';
        this.setData({
            showPicker: false,
            expectCollectTime: timer,
            [expectCollectTime]: e.detail.selectTime.indexOf('小时') > -1 ? e.detail.selectTime : `${formatFreightTime(e.detail.dayIndex)} ${e.detail.selectTime}`,
        });
        this.onBtnIsActive();
        this.getFreightList();
    },
    // 取消时间选择
    cancleTimer(e) {
        this.setData({
            showPicker: false,
        })
    },
    // 跳转相应页面
    goPage(e) {
        let page = e.currentTarget.dataset.page;
        wx.navigateTo({
            url: `/pages/${page}/index`,
        })
    },
    // 下单
    onCreateOrder() {
      console.log("this.data.params",this.data.params)
        if (!this.data.onSelectTerms) {
            wx.showToast({
                title: '请阅读并同意电子运单契约条款后进行下单。',
                icon: 'none',
                duration: 3000
            });
            return;
        }
        if(!checkIsNull(this.data.params.startSortCenter)&&!checkIsNull(this.data.params.endSortCenter)&&this.data.params.startSortCenter !== this.data.params.endSortCenter){
            this.setData({
                notifyToast: true
             });
             let timer = setTimeout(() => {
             clearTimeout(timer);
             this.setData({
                 notifyToast: false
             });
             }, 3000);
            return;
        }
        // if(this.data.params.totalVolume === '')this.data.params.totalVolume='0';
        createOrder(this.data.params).then(res => {
            if (res.code == 200) {
                let waybillNo = '';
                if(this.data.orderType == 'bj'){
                    waybillNo = this.data.waybillNo;
                }else{
                    waybillNo = res.data.waybillNo;
                }
                if (!checkIsNull(this.data.params.orderNo)) {
                    let orderNo =  this.data.params.orderNo;
                    operationRecord({orderNo:orderNo,channel:'4'}).then(res => {});
                    wx.navigateTo({
                        url: '/pages/success/index?waybillNo=' +waybillNo +'&orderNo='+this.data.params.orderNo,
                    })
                }else{
                    wx.navigateTo({
                        url: '/pages/success/index?waybillNo=' + res.data.waybillNo +'&orderNo='+res.data.orderNo,
                    })
                }
            }
        });
    },
    // 关闭结算方式弹窗
    closePaytype(e) {
        let flag = e.detail.params;
        this.setData({
            showPayType: flag
        });
    },
    // 打开结算方式弹窗
    showPayType() {
        this.setData({
            showPayType: true
        });
    },
    // 关闭预估费用弹窗
    closespenddetail(e) {
        this.setData({
            showSpendDetail: false
        });
    },
    onShowSpenddetail() {
        let params = {
            baseFreigt: this.data.params.baseFreigt, //基础费用
            pkPrice: this.data.pkPrice, //包装费
            ipPrice: this.data.ipPrice, //保价费
            srPrice: this.data.srPrice, //签单返还费用
            baseFreigtDiscount: this.data.params.baseFreigtDiscount,
            billWeight: this.data.params.billWeight,
            additionalWeight:this.data.additionalWeight || '',
            additionalWeightPrice:this.data.additionalWeightPrice || '',
            firstWeight:this.data.firstWeight || '',
            firstWeightPrice:this.data.firstWeightPrice || '',
            addedValuedDesc:this.data.addedValuedDesc || '',
        };
        this.setData({
            showSpendDetail: true,
            spendDetail: params
        });
    },
    // 计算费用
    onCalculate() {
        let list = this.data.params.orderServiceDetailVo;
        let num = 0; //增值服务费
        this.data.pkPrice = 0;
        this.data.ipPrice = 0;
        this.data.srPrice = 0;
        for (let i = 0; i < list.length; i++) {
            if ((list[i].serviceCode == 'PK' || list[i].serviceCode == 'SR') && list[i].details.length > 0) {
                list[i].details.map(item => {
                    if (!checkIsNull(item.serviceCharge)) {
                        if (list[i].serviceCode == 'PK') {
                            num = accAdd(num, accMul(item.serviceCharge || 0, item.serviceNum));
                            this.data.pkPrice = accAdd(this.data.pkPrice || 0, accMul(item.serviceCharge || 0, item.serviceNum));
                        } else {
                            num = accAdd(item.serviceCharge || 0, num);
                            this.setData({
                                srPrice: item.serviceCharge
                            });
                        }
                    }
                });
            }
            if (list[i].serviceCode == 'IP') {
                if (!checkIsNull(list[i].details[0].serviceCharge)) {
                    num = accAdd(list[i].serviceCharge || 0, num);
                    this.data.ipPrice = accAdd(this.data.ipPrice || 0, list[i].serviceCharge || 0)
                }
            }
        }
        // let estimateFreight = 'params.estimateFreight';
        let expsPackageInfo = 'params.expsPackageInfo'; 
        let volumeAndWeight = '',
            tempvolumeAndWeight = '',
            weight = this.data.params.totalWeight,
            tempWeight = this.data.params.totalWeight;
        if (!checkIsNull(this.data.params.totalVolume) && !checkIsNull(this.data.productLTRatio)) {
            volumeAndWeight = (accMul(1000000,this.data.params.totalVolume)/this.data.productLTRatio).toFixed(3);
            tempvolumeAndWeight = (accMul(accMul(1000000,this.data.params.totalVolume),1)/this.data.productLTRatio).toFixed(3);
            if (volumeAndWeight > weight) {
                weight = volumeAndWeight;
            }
            if (tempvolumeAndWeight > tempWeight) {
                tempWeight = tempvolumeAndWeight;
            }
        }
        // this.data.totalBillWeight = weight;
        this.data.params.billWeight  = weight;
        this.data.params.totalWeightVolume  = tempvolumeAndWeight;
        let arr = [this.data.params.expsPackageInfo[0]];
        if (this.data.params.totalNum > 0) {
            arr = [];
        }
        for (let i = 0; i < this.data.params.totalNum; i++) {
            let obj = this.data.params.expsPackageInfo[0];
            // obj.billWeight = tempWeight;
            // obj.volumeWeight = tempvolumeAndWeight;
            arr.push(obj);
        }
        this.data.params.expsPackageInfo = arr;
        let servicePrice = 'params.servicePrice';
        let sumPrice = 'params.sumPrice';
        this.setData({
            // [estimateFreight]:accAdd(this.data.params.baseFreigt,num),
            [sumPrice]: accAdd(accAdd(this.data.params.baseFreigt || 0, num), -Math.abs(this.data.params.baseFreigtDiscount || 0)),
            [servicePrice]: num,
            pkPrice: this.data.pkPrice, //包装费
            ipPrice: this.data.ipPrice, //保价费
            [expsPackageInfo]: this.data.params.expsPackageInfo, 
        });
    }
})