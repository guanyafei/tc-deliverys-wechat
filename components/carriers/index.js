let {getDeliveryTime} = require('../../http/index.js');
let {checkIsNull,formatFreightTime} = require('../../utils/util');
Component({
  /**
   * 组件的初始数据
   */
  data: {
    dayIndex:'0',
    timeIndex:'0',
    isShowCurDayTab:true,
    selectTime:'',
    periodList:[],
    periodObj:{}
  },
  properties: {
    siteCode:{
      type:String,
      value:''
    },
    expectCollectTime:{
      type:String,
      value:''
    }
  },
  lifetimes:{
    attached: function() {
     // 检测当前时间是否“晚于”揽收结束时间 是则隐藏当天tab
      // let curTime = new Date().getTime();
      // let endTime = new Date(this.data.endTime).getTime();
      // if(endTime<curTime) this.setData({dayIndex:1,isShowCurDayTab:false});
      // // 设置时间段list
      // this.setPeriodList(this.data.startTime,this.data.endTime);
      return
      getDeliveryTime(this.data.siteCode).then(res=>{ 
        if(res.code == 200){
          if(checkIsNull(this.data.expectCollectTime)){
            this.setData({
              periodObj:res.data,
              periodList:res.data.todayTimes.length>0?res.data.todayTimes:res.data.tomorrowTimes,
              dayIndex:res.data.todayTimes.length>0?'0':'1',
              timeIndex:'0',
              selectTime:res.data.todayTimes.length>0?res.data.todayTimes[0]:res.data.tomorrowTimes[0],
              isShowCurDayTab:res.data.todayTimes.length>0?true:false
            })
          }else{
            if(this.data.expectCollectTime.indexOf('小时')>-1){
              this.setData({
                periodObj:res.data,
                periodList:res.data.todayTimes,
                dayIndex:'0',
                timeIndex:'0',
                selectTime:this.data.expectCollectTime,
                isShowCurDayTab:res.data.todayTimes.length>0?true:false
              })
            }else{
              let timerList = this.data.expectCollectTime.split(' '),index = 0,dayIndex = 1;
              if(timerList[0] == formatFreightTime(0)){
                dayIndex = 0;
                for(let i = 0;i<res.data.todayTimes.length;i++){
                  if(res.data.todayTimes[i] == timerList[1]){
                    index = i;
                    break;
                  }
                }
              }else if(timerList[0] == formatFreightTime(1)){
                dayIndex = 1;
                for(let i = 0;i<res.data.tomorrowTimes.length;i++){
                  if(res.data.tomorrowTimes[i] == timerList[1]){
                    index = i;
                    break;
                  }
                }
              }else if(timerList[0] == formatFreightTime(2)){
                dayIndex = 2;
                for(let i = 0;i<res.data.afterTomorrowTimes.length;i++){
                  if(res.data.afterTomorrowTimes[i] == timerList[1]){
                    index = i;
                    break;
                  }
                }
              }
              this.setData({
                periodObj:res.data,
                periodList:dayIndex == 1?res.data.tomorrowTimes:res.data.afterTomorrowTimes,
                dayIndex:dayIndex,
                timeIndex:index,
                selectTime:timerList[1],
                isShowCurDayTab:res.data.todayTimes.length>0?true:false
              })
            }
          }
        }else{
          wx.showToast({
            title: res.msg,
            icon:'none',
            duration: 3000
          })
        }
      });
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 设置时间段list
    // setPeriodList(start,end){
    //     let step = 2*1000*60*60,startTime = new Date(start.replace(/-/g,'/')).getTime(),endTime= new Date(end.replace(/-/g,'/')).getTime(); 
    //     let count = (endTime-startTime)/step;
    //     let curTime = new Date().getTime(),nextTime = '',period = '';
    //     if(endTime>=curTime && startTime<=curTime && this.data.dayIndex==0){ 
    //       let time = 'periodList[0]'
    //       this.setData({
    //         [time]:'一小时内'
    //       });
    //     };
    //     for(let i=0;i<count;i++){
    //       nextTime = startTime+step;
    //       period = `${this.formatHM(new Date(startTime))}-${this.formatHM(new Date(nextTime))}`;
    //       if((curTime<startTime && this.data.dayIndex ==0) || this.data.dayIndex !=0){
    //         this.data.periodList.push(period);
    //       }
    //       startTime = nextTime;
    //     }
    //     this.setData({
    //       periodList:this.data.periodList
    //     });
    // },
    // // 格式化时分
    // formatHM(date){
    //   const hour = date.getHours();
    //   const minute = date.getMinutes();
    //   return `${[hour, minute].map(n=>{
    //     n = n.toString()
    //     return n[1] ? n : `0${n}`
    //   }).join(':')}`
    // },
    // // 选择日期
    // select(e){
    //   let dayIndex =  e.currentTarget.dataset.dayindex;
    //   this.setData({
    //     dayIndex:dayIndex,
    //     timeIndex:'0',
    //     periodList:[]
    //   });
    //   this.setPeriodList(this.data.startTime,this.data.endTime);
    // },
    // // 选择时间
    // selectTime(e){
    //   let timeIndex =  e.currentTarget.dataset.timeindex;
    //   this.setData({
    //     timeIndex:timeIndex,
    //     selectTime:this.data.periodList[timeIndex]
    //   })
    // },
    // 选择日期
    select(e){
      let dayIndex =  e.currentTarget.dataset.dayindex;
      if(dayIndex == 0){
        this.setData({
          dayIndex:dayIndex,
          timeIndex:'0',
          periodList:this.data.periodObj.todayTimes,
          selectTime:this.data.periodObj.todayTimes[0],
        });
      }else if(dayIndex == 1){
        this.setData({
          dayIndex:dayIndex,
          timeIndex:'0',
          periodList:this.data.periodObj.tomorrowTimes,
          selectTime:this.data.periodObj.tomorrowTimes[0],
        });
      }else if(dayIndex == 2){
        this.setData({
          dayIndex:dayIndex,
          timeIndex:'0',
          periodList:this.data.periodObj.afterTomorrowTimes,
          selectTime:this.data.periodObj.afterTomorrowTimes[0],
        });
      }
    },
    // 选择时间
    selectTime(e){
      let timeIndex =  e.currentTarget.dataset.timeindex;
      this.setData({
        timeIndex:timeIndex,
        selectTime:this.data.periodList[timeIndex]
      })
    },
    // 保存时间
    save(){
      this.triggerEvent('saveCarriers',{selectTime:this.data.selectTime,dayIndex:this.data.dayIndex});
    },
    // 取消、关闭
    cancle(){
      this.triggerEvent('cancleCarriers');
    }
  }
})

