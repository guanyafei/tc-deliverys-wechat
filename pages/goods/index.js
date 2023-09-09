let { decimalPoint, checkIsNull, setIndexList, checkIsMoreInteger, checkInteger , accAdd, accMul} = require('../../utils/util');
let { getAppreciation, getDataLimit } = require('../../http/index.js');
const { baseUrl } = require('../../http/env').dev
Page({
    data: {
        orderType:'xd',//xd:新单 zlyd：再来一单  bj:编辑
        errIndexList: [],
        goodsName: '', //物品名称
        length: '', //长度
        width: '', //宽度
        height: '', //高度
        totalVolume: '', //体积
        totalNum: '1', //件数
        totalWeight: '1', //总重量
        addedPackList: [], //包装
        addedPackDesc: '', //包装服务描述
        switch: false,
        tmsImageInfos: [], // 图片列表
        customerRemark: '',
        orderServiceDetailVo: [], // 增值服务
        remarkLength: 0,
        packOneCode: "",
        packOneName: "",
        packShowPrice: 0,
        showRules: false,
        showPack: false,
        btnActive: false,
        list: [],
        maxHeight: '',
        maxLength: '',
        maxVolume: '',
        maxWeight: '',
        maxWidth: '',
        errIndex: '0', // 错误提示item索引 默认0 '1':预估重量
    },
    onLoad(e) {
        let goodsInfo = JSON.parse(e.params);
        let packList = goodsInfo.addedValueList || [];
        this.data.list = packList;
        let arr = [],
            desc = '';
        for (let i = 0; i < packList.length; i++) {
            if (packList[i].serviceCode == 'PK') {
                this.data.orderServiceDetailVo = packList[i].details;
                // this.data.hasSelectedPackList = packList[i].details;
                let list = packList[i].details;
                for (let j = 0; j < list.length; j++) {
                    desc = `${list[j].serviceName} 数量：${list[j].serviceNum}`;
                    arr.push(desc);
                    this.data.packShowPrice = accAdd(this.data.packShowPrice,accMul(list[i].serviceCharge || 0,list[i].serviceNum || 0))
                }
            }
        }
        this.setData({
            orderType:goodsInfo.orderType,
            goodsName: goodsInfo.goodsName, //物品名称
            length: goodsInfo.length, //长度
            width: goodsInfo.width, //宽度
            height: goodsInfo.height, //高度
            totalVolume: goodsInfo.totalVolume, //体积
            totalNum: goodsInfo.totalNum || '1', //件数
            totalWeight: goodsInfo.weight || '1', //总重量
            switch:  goodsInfo.totalVolume > 0 ? true : false,
            tmsImageInfos: goodsInfo.tmsImageInfos, // 图片列表
            customerRemark: goodsInfo.customerRemark,
            addedPackDesc: arr.join(";"),
            orderServiceDetailVo: this.data.orderServiceDetailVo
        });
        getAppreciation().then(res => {
            if (res.code == 200) {
                let arr = res.data.filter(item => {
                    return item.oneCode == 'PK';
                });
                if (arr.length > 0) {
                    this.setData({
                        addedPackList: arr[0].children,
                        packOneCode: arr[0].oneCode,
                        packOneName: arr[0].oneName
                    });
                }
            }
        });
        getDataLimit().then(res => {
            if (res.code == 200) {
                this.setData({
                    maxHeight: res.data.maxHeight,
                    maxLength: res.data.maxLength,
                    maxVolume: res.data.maxVolume,
                    maxWeight: res.data.maxWeight,
                    maxWidth: res.data.maxWidth,
                });
            } 
        });
        this.onBtnIsActive();
    },
    // 备注输入
    onInputRemark(e) {
        let remark = e.detail.value;
        this.setData({
            remarkLength: remark.length
        })
    },
    // 物品分类删除
    del() {
        this.setData({
            goodsName: ''
        });
        this.onBtnIsActive();
    },
    //提交是否激活
    onBtnIsActive() {
        this.setData({
            btnActive: this.data.errIndexList.length == 0 && !checkIsNull(this.data.goodsName) && !checkIsNull(this.data.totalWeight)
        })
    },
    // 保存
    save() {
        if(!checkIsNull(this.data.length) && (checkIsNull(this.data.width) || checkIsNull(this.data.height))){
           if(checkIsNull(this.data.width)){
            wx.showToast({
                title: '请输入物品宽度！',
                icon: 'none',
                duration: 3000
              });
           }
           if(checkIsNull(this.data.height)){
            wx.showToast({
                title: '请输入物品高度！',
                icon: 'none',
                duration: 3000
              });
           }
           return
        }
        if(!checkIsNull(this.data.width) && (checkIsNull(this.data.length) || checkIsNull(this.data.height))){
           if(checkIsNull(this.data.length)){
            wx.showToast({
                title: '请输入物品长度！',
                icon: 'none',
                duration: 3000
              });
           }
           if(checkIsNull(this.data.height)){
            wx.showToast({
                title: '请输入物品高度！',
                icon: 'none',
                duration: 3000
              });
           }
           return
        }
        if(!checkIsNull(this.data.height) && (checkIsNull(this.data.length) || checkIsNull(this.data.width))){
            if(checkIsNull(this.data.height)){
             wx.showToast({
                 title: '请输入物品长度！',
                 icon: 'none',
                 duration: 3000
               });
            }
           if(checkIsNull(this.data.width)){
            wx.showToast({
                title: '请输入物品宽度！',
                icon: 'none',
                duration: 3000
              });
           }
           return
        }
        if(checkIsNull(this.data.totalNum) || this.data.totalNum==0){
         wx.showToast({
             title: '请输入物品件数！',
             icon: 'none',
             duration: 3000
           });
           return
        }
        if(checkIsNull(this.data.totalWeight) || this.data.totalWeight==0){
         wx.showToast({
             title: '请输入预估物品重量！',
             icon: 'none',
             duration: 3000
           });
           return
        }
        if(checkIsNull(this.data.goodsName)){
         wx.showToast({
             title: '请输入物品名称！',
             icon: 'none',
             duration: 3000
           });
           return
        }
        if (this.data.errIndexList.length > 0 || !this.data.btnActive) return;
        let pages = getCurrentPages();
        //获取上一个页面
        let prevPage = pages[pages.length - 2];
        //修改上一个页面的变量
        let totalNum = "params.totalNum";
        let tmsImageInfos = "params.tmsImageInfos";
        let customerRemark = "params.customerRemark";
        let orderServiceDetailVo = "params.orderServiceDetailVo";
        let goodsName = "params.goodsName";
        let expsPackageInfo = "params.expsPackageInfo"; 
        let totalWeight = "params.totalWeight";
        let totalVolume = "params.totalVolume";
        let length = "params.length";
        let width = "params.width";
        let height = "params.height";
        for(let i=0;i<this.data.orderServiceDetailVo.length;i++){
            this.data.packShowPrice = accAdd(this.data.packShowPrice,accMul(this.data.orderServiceDetailVo[i].serviceCharge || 0,this.data.orderServiceDetailVo[i].serviceNum || 0));
        }
        let addedValue = {
            serviceCharge: this.data.packShowPrice,
            serviceName: this.data.packOneName,
            serviceCode: this.data.packOneCode,
            details: this.data.orderServiceDetailVo
        };
        if(this.data.orderServiceDetailVo.length != 0){
            for (let i = 0; i < this.data.list.length; i++) {
                if (this.data.list[i].serviceCode == this.data.packOneCode) {
                    this.data.list.splice(i, 1, addedValue)
                }
            }
            let i = -1;
            let flag = this.data.list.some((item, index) => {
                i = index;
                return item.serviceCode == this.data.packOneCode
            });
            if (flag) {
                this.data.list.splice(i, 1, addedValue);
            } else {
                this.data.list.push(addedValue)
            }
        }
        
        let standardStr = '';
        if (!checkIsNull(this.data.totalNum) && this.data.totalNum > 0) {
            standardStr += `${this.data.totalNum}件 | `
        }
        if (!checkIsNull(this.data.width) && this.data.width > 0) {
            standardStr += `${this.data.length}*${this.data.width}*${this.data.height} | `
        }
        if (!checkIsNull(this.data.totalVolume) && this.data.totalVolume > 0) {
            standardStr += `${this.data.totalVolume}m³`
        }
        if(standardStr.substr(standardStr.length-3,standardStr.length)==" | "){
            standardStr=standardStr.substr(0,standardStr.length-3);
        }
        prevPage.setData({
            [expsPackageInfo]: [{
                height: 0,
                length: 0,
                width: 0,
                weight: 0,
                volume: 0
            }],
            [length]: this.data.length,
            [width]: this.data.width,
            [height]: this.data.height,
            [totalNum]: this.data.totalNum,
            [totalWeight]: this.data.totalWeight,
            [totalVolume]: this.data.totalVolume,
            [tmsImageInfos]: this.data.tmsImageInfos,
            [customerRemark]: this.data.customerRemark,
            [orderServiceDetailVo]: this.data.list,
            [goodsName]: this.data.goodsName,
            standardDesc: standardStr
        });
        prevPage.onCalculate();
        prevPage.getFreightList();
        prevPage.getEstimateCost();
        wx.navigateBack();
    },
    // 体积计算
    calcVolume() {
        let volume = (parseFloat(this.data.length) * parseFloat(this.data.width) * parseFloat(this.data.height) / 1000000).toFixed(3);
        if (volume < 0.001) {
            this.setData({
                totalVolume: 0
            });
        } else {
            let flag = false;
            if (volume > this.data.maxVolume) {
                flag = true;
            }
            this.setData({
                totalVolume: volume,
                errIndexList: setIndexList(this.data.errIndexList, 2, flag)
            });
        }
    },
    // 件数校验
    getTotalNum(e){
        let val = e.detail.value;
        let flag = checkIsMoreInteger(val);
        val = checkInteger(val);
        this.setData({
            totalNum: val,
            errIndexList: setIndexList(this.data.errIndexList, '7', !flag)
        })
    },
    // 体积校验
    getVolume(e) {
        let val = e.detail.value;
        val = decimalPoint(val);
        let index = e.currentTarget.dataset.index;
        let flag = false;
        if (val > this.data.maxVolume) {
            flag = true;
        }
        this.setData({
            totalVolume: val,
            length: '', 
            width: '',
            height: '', 
            errIndexList: setIndexList(this.data.errIndexList, index, flag),
        });
    },
    // 删除图片
    delImg(e) {
        let index = e.currentTarget.dataset.index;
        this.data.tmsImageInfos.splice(index, 1);
        this.setData({
            tmsImageInfos: this.data.tmsImageInfos
        })
    },
    // 上传图片
    upload() {
        if (this.data.tmsImageInfos.length >= 6) {
            wx.showToast({
                title: '最多只能上传6张图片',
                icon: 'none'
            })
        } else {
            wx.chooseImage({
                count: 6, //最多可以选择的图片总数
                sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: (res) => {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    let tempFilePaths = res.tempFilePaths;
                    //限制上传图片大小为10M,所有图片少于10M才能上传
                    let answer = res.tempFiles.every(item => {
                        return item.size <= 10000000
                    })
                    if (answer) {
                        for (let i = 0; i < res.tempFilePaths.length; i++) {
                            let imgUrl = res.tempFilePaths[i];
                            // 发送请求
                            this.updattimages(imgUrl);
                        }
                    } else {
                        wx.showToast({
                            title: '上传图片不能大于10M!',
                            icon: 'none'
                        })
                    }
                    console.log(tempFilePaths)
                }
            });
        }
    },
    updattimages(e) {
        wx.showLoading({
            title: '上传中'
        });
        let _this = this
        let token = wx.getStorageSync('token')
        console.log(e)
        wx.uploadFile({
            url: baseUrl + '/oms/order/uploadGFSImgFiles',
            filePath: e,
            name: 'file',
            header: {
                'Authorization': token,
            },
            success(res) {
                wx.hideLoading();
                let osda = JSON.parse(res.data)
                const data = osda.data[0]
                console.log(data, osda)
                let str = {
                    imageName: data.imageName,
                    imageUrl: data.imageUrl
                }
                if (_this.data.tmsImageInfos.length < 6) {
                    _this.data.tmsImageInfos.push(str);
                    _this.setData({
                        tmsImageInfos: _this.data.tmsImageInfos
                    })
                } else if (_this.data.tmsImageInfos.length >= 6) {
                    wx.showToast({
                        title: '最多只能上传6张图片',
                        icon: 'none'
                    })
                }
            }
        })
    },
    // 检测是否可计算体积
    checkSideLength() {
        if (this.data.length != '' && this.data.width != '' && this.data.height != '') {
            this.calcVolume();
        } else {
            this.setData({
                totalVolume: ''
            });
        }
    },
    // 长度检测
    getLength(e) {
        let val = e.detail.value;
        val = decimalPoint(val);
        this.checkSideLength();
        let index = e.currentTarget.dataset.index;
        let flag = false;
        if (val > this.data.maxLength) {
            flag = true;
        }
        this.setData({
            length: val,
            errIndexList: setIndexList(this.data.errIndexList, index, flag)
        })
    },
    // 宽度检测
    getWidth(e) {
        let val = e.detail.value;
        val = decimalPoint(val);
        this.checkSideLength();
        let index = e.currentTarget.dataset.index;
        let flag = false;
        if (val > this.data.maxWidth) {
            flag = true;
        }
        this.setData({
            width: val,
            errIndexList: setIndexList(this.data.errIndexList, index, flag)
        })
    },
    // 高度检测
    getHeight(e) {
        let val = e.detail.value;
        val = decimalPoint(val);
        this.checkSideLength();
        let index = e.currentTarget.dataset.index;
        let flag = false;
        if (val > this.data.maxHeight) {
            flag = true;
        }
        this.setData({
            height: val,
            errIndexList: setIndexList(this.data.errIndexList, index, flag)
        })
    },
    // 重量检测
    getWeight(e) {
        let val = e.detail.value;
        val = decimalPoint(val);
        let index = e.currentTarget.dataset.index;
        let flag = false;
        if (val > this.data.maxWeight) {
            flag = true;
        }
        this.setData({
            totalWeight: val,
            errIndexList: setIndexList(this.data.errIndexList, index, flag)
        });
        this.onBtnIsActive();
    },
    // 加 体积
    addVolume(e) {
      if( this.data.orderType==='bj') return;
        let num = this.data.totalVolume;
        let index = e.currentTarget.dataset.index;
        num++;
        let flag = false;
        this.setData({
            errIndexList: setIndexList(this.data.errIndexList, '3', false),
            errIndexList: setIndexList(this.data.errIndexList, '4', false),
            errIndexList: setIndexList(this.data.errIndexList, '5', false),
        });
        if (num > this.data.maxVolume) {
            flag = true;
        }
        this.setData({
            totalVolume: parseFloat(num).toFixed(2) - 0,
            length: '', 
            width: '',
            height: '', 
            errIndexList: setIndexList(this.data.errIndexList, index, flag)
        });
    },
    // 减 体积
    reduceVolume(e) {
      if( this.data.orderType==='bj') return;
        let num = this.data.totalVolume;
        let index = e.currentTarget.dataset.index;
        num--;
        this.setData({
            errIndexList: setIndexList(this.data.errIndexList, '3', false),
            errIndexList: setIndexList(this.data.errIndexList, '4', false),
            errIndexList: setIndexList(this.data.errIndexList, '5', false),
        });
        if (num < 0) {
            this.setData({
                totalVolume: parseFloat(num).toFixed(2) - 0 + 1,
                length: '', 
                width: '',
                height: '', 
            })
        } else {
            let flag = false;
            if (num > this.data.maxVolume) {
                flag = true;
            }
            this.setData({
                totalVolume: parseFloat(num).toFixed(2) - 0,
                length: '', 
                width: '',
                height: '', 
                errIndexList: setIndexList(this.data.errIndexList, index, flag)
            });
        }
    },
    // 加 重量
    addWeight(e) {
      if( this.data.orderType==='bj') return;
        let num = this.data.totalWeight;
        let index = e.currentTarget.dataset.index;
        num++;
        let flag = false;
        if (num > this.data.maxWeight) {
            flag = true;
        }
        this.setData({
            totalWeight: parseFloat(num).toFixed(2) - 0,
            errIndexList: setIndexList(this.data.errIndexList, index, flag)
        });
        this.onBtnIsActive();
    },
    // 减 重量
    reduceWeight(e) {
        if( this.data.orderType==='bj') return;
        let num = this.data.totalWeight;
        let index = e.currentTarget.dataset.index;
        num--;
        if (num < 0) {
            this.setData({
                totalWeight: parseFloat(num).toFixed(2) - 0 + 1
            })
        } else {
            let flag = false;
            if (num > this.data.maxWeight) {
                flag = true;
            }
            this.setData({
                totalWeight: parseFloat(num).toFixed(2) - 0,
                errIndexList: setIndexList(this.data.errIndexList, index, flag)
            })
        }
    },
    // 加 件数
    addTotalNum(e) {
      if( this.data.orderType==='bj') return;
        let num = this.data.totalNum;
        num++;
        this.setData({
            totalNum: parseFloat(num).toFixed(2) - 0,
            errIndexList: setIndexList(this.data.errIndexList, '7', false)
        })
    },
    // 减 件数
    reduceTotalNum(e) {
      if( this.data.orderType==='bj') return;
        let num = this.data.totalNum;
        num--;
        if (num < 0) {
            this.setData({
                totalNum: parseFloat(num).toFixed(2) - 0 + 1,
                errIndexList: setIndexList(this.data.errIndexList, '7', false)
            })
        } else {
            this.setData({
                totalNum: parseFloat(num).toFixed(2) - 0,
                errIndexList: setIndexList(this.data.errIndexList, '7', false)
            })
        }
    },
    // 补充体积
    switchChange(e) {
        let flag = e.detail.value;
        this.setData({
            switch: flag
        });
        if (!flag) {
            this.setData({
                length: '',
                width: '', //宽度
                height: '', //高度
                totalVolume: '', //体积
            });
        }
    },
    // 关闭规则弹窗
    closerules(e) {
        let flag = e.detail.params;
        this.setData({
            showRules: flag
        });
    },
    showRules() {
        this.setData({
            showRules: true
        });
    },
    // 关闭包装弹窗
    closePack(e) {
        let flag = e.detail.params;
        this.setData({
            showPack: flag
        });
    },
    showPack() {
        this.setData({
            showPack: true
        });
    },
    // 获取pack数据
    getPack(e) {
        let pages = getCurrentPages();
        //获取上一个页面
        let prevPage = pages[pages.length - 2];
        let packList = e.detail.params;
        this.data.orderServiceDetailVo = [];
        let desc = '',
            arr = [],
            addedValuedStr = [];
        for (let key in packList) {
            desc = `${packList[key].serviceName} 数量：${packList[key].serviceNum}`;
            arr.push(desc);
            this.data.orderServiceDetailVo.push(packList[key]);
            addedValuedStr.push(`${packList[key].serviceName}x${packList[key].serviceNum} ¥${packList[key].serviceCharge}*${packList[key].serviceNum}`);
        }
        this.setData({
            showPack: false,
            addedPackDesc: arr.join(";"),
            orderServiceDetailVo: this.data.orderServiceDetailVo
        });
        prevPage.setData({
            addedValuedDesc: addedValuedStr.join(' | ')
        });
    },
    // 跳转相应页面
    goPage(e) {
        let page = e.currentTarget.dataset.page;
        if (page == 'contraband') {
            wx.navigateTo({
                url: "/pages/contraband/index",
            })
        } else if (page == 'itemType') {
            wx.navigateTo({
                url: `/pages/itemType/index?name=${this.data.goodsName}`,
            })
        }
    }
})