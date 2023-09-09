let {decimalPoint,formatFreightTime} = require('../../utils/util');
let {getFreight,getDeliveryTime} = require('../../http/index.js');
Page({
  data: {
    showAddress:false,
    showPicker:false,
    sendAlladders:'请选择',
    reciverAlladders:'请选择',
    errIndex:0,
    sendAddersObj:[{
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
    reciverAddersObj:[{
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
    addressType:'send',
    isNoSite:false,
    dayTitle:'',
    length:'',
    width:'',
    height:'',
    list:[],
    params:{
      delivery_city_code:'',
      delivery_street_code:'',
      dest_city_code:'',
      dest_street_code:'',
      height:'',
      length:'',
      width:'',
      delivery_time:'',
      weight:'0',
      volume:''
    }
  },
  onLoad(e) {
  },
  calcVolume(){
    let volume = (parseFloat(this.data.params.length)*parseFloat(this.data.params.width)*parseFloat(this.data.params.height)).toFixed(3);
    let goodsVolume = 'params.volume';
    if(volume<0.001){
      this.setData({
        [goodsVolume]: 0.001
      });
    }else{
      this.setData({
        [goodsVolume]: volume
      });
    }
  },
  save(){
    this.setData({
      isNoSite:false
    });
    let length = 'params.length';
    let width = 'params.width';
    let height = 'params.height';
    this.setData({
      [length]:String(this.data.length*0.01),
      [width]:String(this.data.width*0.01),
      [height]:String(this.data.height*0.01),
    });
    this.calcVolume();
    getFreight(this.data.params).then(res=>{
      if(res.code == 200){
        this.setData({
          list:res.data || []
        });
      }else if(res.code == 201){
        this.setData({
          isNoSite:true
        })
      }
    });
  },
  getLength(e){
    let val = e.detail.value;
    val = decimalPoint(val);
    this.setData({
      length: val
    })
  },
  // 宽度检测
  getWidth(e){
    let val = e.detail.value;
    val = decimalPoint(val);
    this.setData({
      width: val
    })
  },
  // 高度检测
  getHeight(e){
    let val = e.detail.value;
    val = decimalPoint(val);
    this.setData({
      height: val
    })
  },
  // 重量检测
  getWeight(e){
    let val = e.detail.value;
    val = decimalPoint(val);
    let weight = 'params.weight';
    this.setData({
      [weight]: val
    })
  },
  // 加 重量
  addWeight(e){
    let num = this.data.params.weight;
    let weight = 'params.weight';
    num++;
    if(num>5){
      let errIndex = e.currentTarget.dataset.index;
      this.setData({
        [weight]: String(parseFloat(num).toFixed(2) - 0 -1),
        errIndex: errIndex
      });
    }else{
      this.setData({
        [weight]:  String(parseFloat(num).toFixed(2) - 0),
        errIndex: '0'
      })
    }
  },
  // 减 重量
  reduceWeight(e){
    let num = this.data.params.weight;
    let weight = 'params.weight';
    num--;
    if(num<0){
      this.setData({
        [weight]: parseFloat(num).toFixed(2) - 0 +1
      })
    }else{
      this.setData({
        [weight]: parseFloat(num).toFixed(2) - 0 ,
        errIndex: '0'
      })
    }
  },
  // 获取地址
  getAddress(e){
    this.setData({
      showAddress:false,
    });
    if(this.data.addressType == 'send'){
      let delivery_city_code = "params.delivery_city_code";
      let delivery_street_code = "params.delivery_street_code";
      this.setData({
        sendAlladders:e.detail.params.alladders,
        sendAddersObj:e.detail.params.area,
        [delivery_city_code]:e.detail.params.area[1].firstCode,
        [delivery_street_code]:e.detail.params.area[3].firstCode,
      });
      getDeliveryTime(e.detail.params.area[3].firstCode).then(res=>{
        if(res.code == 200){
          let delivery_time = "params.delivery_time";
          if(res.data.todayTimes.length==0){
            this.setData({
              dayTitle:'明天'+res.data.tomorrowTimes[0],
              [delivery_time]:`${formatFreightTime(1)} ${res.data.tomorrowTimes[0]}`
            })
          }else{
            this.setData({
              dayTitle:'今天'+res.data.todayTimes[0],
              [delivery_time]:res.data.todayTimes[0].indexOf('小时')==-1?`${formatFreightTime(0)} ${res.data.todayTimes[0]}`:res.data.todayTimes[0]
            })
          }
        }
      });
    }else{
      let dest_city_code = "params.dest_city_code";
      let dest_street_code = "params.dest_street_code";
      this.setData({
        reciverAlladders:e.detail.params.alladders,
        reciverAddersObj:e.detail.params.area,
        [dest_city_code]:e.detail.params.area[1].firstCode,
        [dest_street_code]:e.detail.params.area[3].firstCode
      })
    }
  },
  // 显示地址弹框
  showAddress(e){
    let type = e.currentTarget.dataset.type;
    this.setData({
      showAddress:true,
      addersObj:type == 'send'?this.data.sendAddersObj:this.data.reciverAddersObj,
      addressType:type
    })
  },
  closeAddress(e){
    let flag = e.detail.params;
    this.setData({
      showAddress:flag,
    })
  },
   //显示日期组件
   getTimerPicker(){
    this.setData({
      showPicker:true,
    })
  },
  // 保存时间
  savetimer(e){
    let selectTime = e.detail.selectTime;
    let dayIndex = e.detail.dayIndex;
    let delivery_time = "params.delivery_time";
    if(dayIndex == 0){
      this.setData({
        dayTitle:'今天'+selectTime,
        [delivery_time]:selectTime.indexOf('小时')==-1?`${formatFreightTime(0)} ${selectTime}`:selectTime
      })
    }else if(dayIndex == 1){
      this.setData({
        dayTitle:'明天'+selectTime,
        [delivery_time]:`${formatFreightTime(1)} ${selectTime}`
      })
    }else if(dayIndex == 2){
      this.setData({
        dayTitle:'后天'+selectTime,
        [delivery_time]:`${formatFreightTime(2)} ${selectTime}`
      })
    }
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
})
