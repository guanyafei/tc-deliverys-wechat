let { getAppreciationDocument, getAppreciation, getForecast,getDataLimit } = require('../../http/index.js');
let { checkNonZeroHead, checkIsNull } = require('../../utils/util');
Page({
    data: {
        name: '1',
        desc: '',
        price: '--',
        serviceCharge: '',
        serviceName: '',
        serviceCode: 'IP',
        btnActive: false,
        addedValueList: [],
        insureEnd:'',
        insureStart:''
    },
    onLoad(e) {
        let addedValueList = JSON.parse(e.addValuedList); 
        if (addedValueList.length > 0) {
            this.setData({
                addedValueList: addedValueList
            });
            for(let i=0;i<addedValueList.length;i++){
                if(addedValueList[i].serviceCode=='IP'){
                    this.setData({
                        serviceCharge:addedValueList[i].details[0].valuationCharge,
                        price:addedValueList[i].details[0].serviceCharge,
                        btnActive:true
                    });
                }
            }
        }
        let params = {
            copyCode: this.data.serviceCode
        };
        getAppreciationDocument(params).then(res => {
            if (res.code == 200) {
                this.setData({
                    desc: res.msg
                });
            }
        });
        getAppreciation().then(res => {
            if (res.code == 200) {
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].oneCode == this.data.serviceCode) {
                        this.setData({
                            serviceName: res.data[i].oneName
                        });
                        return;
                    }
                }
            }
        });
        getDataLimit().then(res=>{
          if(res.code == 200){
            this.setData({
                insureEnd:res.data.insureEnd,
                insureStart:res.data.insureStart,
            })
          }
        });
    },
    // 保价费校验
    onInputCharge(e) {
        let val = e.detail.value;
        val = checkNonZeroHead(val);
        this.setData({
            serviceCharge: val,
            btnActive: val.length > 0 ? true : false,
            price: checkIsNull(val) ? '--' : this.data.price
        })
    },
    onInputBlur(e) {
        let val = e.detail.value;
        if (checkIsNull(val)) {
            this.setData({
                price: '--'
            });
            return
        };
        if (val > this.data.insureEnd) {
            this.setData({
                serviceCharge:this.data.insureEnd
            })
            wx.showModal({
                title: '温馨提示',
                content: `声明价值上限为${this.data.insureEnd}元，若价值大于${this.data.insureEnd}元，请咨询收派员或400-128-8000`,
                confirmText:'我知道了',
                confirmColor:'#417CF7',
                showCancel:false,
                success (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                    }
                }
            });
        }
        // 计算保价
        let userInfo = wx.getStorageSync('userInfo');
        let params = {
            type: '1',
            valuationCharge: this.data.serviceCharge,
            consignorCustomerCode: userInfo.balanceLoginNo
        }
        getForecast(params).then(res => {
            if (res.code == 200) {
                this.setData({
                    price: res.data.supportValueFee || '--'
                });
            } else {
                if (val <= this.data.insureEnd) {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 3000
                    })
                }
            }
        });
    },
    // 取消保价
    cancle() {
        let pages = getCurrentPages();
        //获取上一个页面
        let prevPage = pages[pages.length - 2];
        for (let i = 0; i <  this.data.addedValueList.length; i++) {
            if ( this.data.addedValueList[i].serviceCode == this.data.serviceCode) {
                this.data.addedValueList.splice(i, 1);
            }
        }
        let orderServiceDetailVo = 'params.orderServiceDetailVo';
        prevPage.setData({
            [orderServiceDetailVo]: this.data.addedValueList,
            bjfwDesc:'声明物品价值并保价'
        })
        prevPage.onCalculate();
        wx.navigateBack();
    },
    // 保价
    save() {
        if(checkIsNull(this.data.serviceCharge)){
            wx.showToast({
                title: '请输入货品价值！',
                icon: 'none',
                duration: 3000
            });
            this.setData({
                price: '--'
            });
            return;
        }
        if (!this.data.btnActive) return;
        if (this.data.serviceCharge > this.data.insureEnd) {
            this.setData({
                serviceCharge:this.data.insureEnd
            })
            wx.showModal({
                title: '温馨提示',
                content: `声明价值上限为${this.data.insureEnd}元，若价值大于${this.data.insureEnd}元，请咨询收派员或400-128-8000`,
                confirmText:'我知道了',
                confirmColor:'#417CF7',
                showCancel:false,
                success (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                    }
                }
            });
        }
        // 计算保价
        let userInfo = wx.getStorageSync('userInfo');
        let params = {
            type: '1',
            valuationCharge: this.data.serviceCharge,
            consignorCustomerCode: userInfo.balanceLoginNo
        }
        getForecast(params).then(res => {
            if (res.code == 200) {
                this.setData({
                    price: res.data.supportValueFee || '--'
                });
                let pages = getCurrentPages();
                //获取上一个页面
                let prevPage = pages[pages.length - 2];
                let obj = {};
                if (this.data.price != '--') {
                    for (let i = 0; i <  this.data.addedValueList.length; i++) {
                        if ( this.data.addedValueList[i].serviceCode == this.data.serviceCode) {
                            obj.serviceName =  this.data.addedValueList[i].serviceName;
                            obj.serviceCode = this.data.serviceCode;
                            obj.serviceCharge = this.data.price;
                            obj.details = [{
                                serviceName:  this.data.addedValueList[i].serviceName,
                                serviceCode: this.data.serviceCode,
                                valuationCharge: this.data.serviceCharge,
                                serviceCharge: this.data.price,
                            }];
                            this.data.addedValueList.splice(i, 1, obj);
                        }
                    }
                    if (Object.keys(obj).length == 0) {
                        this.data.addedValueList.push({
                            serviceName: this.data.serviceName,
                            serviceCode: this.data.serviceCode,
                            serviceCharge: this.data.price,
                            details: [{
                                serviceName: this.data.serviceName,
                                serviceCode: this.data.serviceCode,
                                valuationCharge: this.data.serviceCharge,
                                serviceCharge: this.data.price,
                            }]
                        })
                    }
                }
                let orderServiceDetailVo = 'params.orderServiceDetailVo';
                prevPage.setData({
                    [orderServiceDetailVo]: this.data.addedValueList,
                    bjfwDesc:`自定义物品价值${this.data.serviceCharge}元`
                })
                prevPage.onCalculate();
                wx.navigateBack();
            } else {
                if (val <= this.data.insureEnd) {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 3000
                    })
                }
            }
        });
    }
})