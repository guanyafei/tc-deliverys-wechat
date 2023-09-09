let { getopenadres , getopenacity , getacoun, getStreet } = require('../../http/index.js');
let { checkIsNull } = require('../../utils/util');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    addersObj:{
      type:Array,
      value:[
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
        }
      ]
    }
  },
  observers: {
    'addersObj':function(val){
      let defaultAddres = !checkIsNull(val[0].firstArea)?val:this.data.adders;
      let no = checkIsNull(val[0].firstArea)?0:3;
      getopenadres().then((res)=>{
        this.setData({
          list:res.data || [],
          adders:defaultAddres,
          num:no
        });
        if(checkIsNull(val[0].firstArea)) return;
        this.getInitData();
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    adders:[
      {
        firstArea:'请选择',
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
      }
    ],
    list:[],//省
    citylist:[],//市
    counlist:[],//区
    streetlist:[],//街道
    num:0,
  },
  lifetimes:{
    attached: function() {
      // 在组件实例进入页面节点树时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //阻止事件冒泡
    all(){},
    //关闭弹窗
    close(){
      this.triggerEvent('closeAddress',{params:false})
    },
    // 切换title
    choise(e){
      let index = e.currentTarget.dataset.index;
      this.setData({ 
        num:index
      });
      let value1 = 'adders[1].firstArea',code1 = 'adders[1].firstCode';
      let value2 = 'adders[2].firstArea',code2 = 'adders[2].firstCode';
      let value3 = 'adders[3].firstArea',code3 = 'adders[3].firstCode';
      if(this.data.num==0){//点击省需要清空市和区
        this.setData({ 
          [value1]:'',
          [code1]:'',
          [value2]:'',
          [code2]:'',
          [value3]:'',
          [code3]:'',
        });
      }else if(this.data.num==1){//点击市需要清空区
        this.setData({ 
          [value2]:'',
          [code2]:'',
          [value3]:'',
          [code3]:'',
        });
      }else if(this.data.num==2){
        this.setData({ 
          [value3]:'',
          [code3]:'',
        });
      }
    },
    // 获取初始数据
    getInitData(){
      getopenacity(this.data.adders[0].firstCode).then((res)=>{
        this.setData({
          citylist:res.data || []
        });
      });
      getacoun(this.data.adders[1].firstCode).then((res)=>{
        this.setData({
          counlist:res.data || []
        });
      });
      getStreet(this.data.adders[2].firstCode).then(res=>{
        this.setData({
          streetlist:res.data || []
        })
      });
    },
    //获取点击的省
    getadd(e){
      let adsrname = e.currentTarget.dataset.arr;
      let value = 'adders[' + this.data.num + ']';
      let next = 'adders[1].firstArea'+ '';
      let obj = {
        firstArea:adsrname.firstArea,
        firstCode:adsrname.firstCode
      };
        this.setData({
          [value]:obj,
          num:1,
          [next]:'请选择'
        })
        getopenacity(adsrname.firstCode).then((res)=>{
          this.setData({
            citylist:res.data || []
          })
        })
    },
    //获取点击的市
    getcity(e){
      let adsrname = e.currentTarget.dataset.arr;
      let value = 'adders[' + this.data.num + ']';
      let next = 'adders[2].firstArea'+ '';
      
      let obj = {
        firstArea:adsrname.secondArea,
        firstCode:adsrname.secondCode
      };
      this.setData({
        [value]:obj,
        num:2,
        [next]:'请选择'
      })
      getacoun(adsrname.secondCode).then((res)=>{
        this.setData({
          counlist:res.data || []
        })
      })
    },
    //点击获取区
    getcoun(e){
      let adsrname = e.currentTarget.dataset.arr;
      let value = 'adders[' + this.data.num + ']';
      let next = 'adders[3].firstArea'+ '';
      let obj = {
        firstArea:adsrname.thirdArea,
        firstCode:adsrname.thirdCode
      };
      this.setData({
        [value]:obj,
        num:3,
        [next]:'请选择'
      });
      // 请求街道
      getStreet(adsrname.thirdCode).then(res=>{
        this.setData({
          streetlist:res.data || []
        })
      });
    },
    // 点击设置街道
    getstreet(e){
      let adsrname = e.currentTarget.dataset.arr; 
      let value = 'adders[' + this.data.num + ']';
      let obj = {
        firstArea:adsrname.fouthArea,
        firstCode:adsrname.fouthCode
      };
      this.setData({
        [value]:obj,
      });
      let addressObj = {
        area:this.data.adders,
        alladders:`${this.data.adders[0].firstArea} ${this.data.adders[1].firstArea} ${this.data.adders[2].firstArea} ${this.data.adders[3].firstArea}`
      }
      this.triggerEvent('getAddress',{params:addressObj})
    }
  }
})
