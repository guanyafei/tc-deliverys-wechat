let {getBookList} = require('../../http/index.js');
Page({
  data: {
    list:[],
    total:0,
    loadMore:true,
    sign_status:'0',//0:未签约 1：已签约
    params:{
      user_name:'',
      pageSize:20,
      pageNum:1,
      search_name:'',
      address_type:''
    }
  },
  onLoad(option) {
    let address_type = 'params.address_type';
    this.setData({
      [address_type]:option.addressType || ''
    })
  },
  onShow(){
    let userInfo = wx.getStorageSync('userInfo');
    let user_name = 'params.user_name';
    let page_size = 'params.pageSize';
    let page_num = 'params.pageNum';
    this.setData({
      [user_name]:userInfo.userName,
      sign_status:userInfo.consumerSignStatus,
      list:[],
      [page_size]:20,
      [page_num]:1,
      loadMore:true,
      total:0,
    });
    this.getList();
  },
  // 查询
  gotSearch(e){
    let searchKey =  e.detail.value;
    let search_name = 'params.search_name';
    this.setData({
      [search_name]:searchKey
    });
    this.setData({
      total:0,
      loadMore:true,
      list:[]
    })
    this.getList();
  },
  // 获取地址列表
  getList(mark=''){
    if (!this.data.loadMore) return;
    getBookList(this.data.params).then(res=>{
      if(res.code == 200){
        if(res.code == 200){
          let list = this.data.list.concat(res.data.rows);
          let pageNum = "params.pageNum";
          this.setData({
            list:list,
            total:res.data.total || 0,
            loadMore:res.data.total == list.length ? false : true,
            [pageNum]:res.data.rows.length==this.data.params.pageSize?++this.data.params.pageNum:this.data.params.pageNum,
          });
        }
      }
    });
  },
  onSelected(e){
    let index = e.currentTarget.dataset.index;
    let item = this.data.list[index];
    // 获取上个页面对象
    let pages = getCurrentPages();
    //获取上一个页面
    let prevPage = pages[pages.length - 2]; 
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
      prevPage.setData({
        [consignor]:item.name,
        [consignorPhone]:item.phone,
        [consignorCompanyName]:item.consumerName,
        [consignorProvince]:item.bookProvince,
        [consignorProvinceName]:item.bookProvinceName,
        [consignorCity]:item.bookCity,
        [consignorCityName]:item.bookCityName,
        [consignorDistrict]:item.bookDistrict,
        [consignorDistrictName]:item.bookDistrictName,
        [consignorStreet]:item.bookStreet,
        [consignorStreetName]:item.bookStreetName,
        [consignorDetailAddress]:item.bookAddress
      });
      prevPage.sendUserInfo=Object.assign({}, prevPage.sendUserInfo,item);
      prevPage.setData({
        sendUserInfo:prevPage.sendUserInfo
      });
      prevPage.getSortingCenterInfo('startSortCenter',item.bookStreet);
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
      prevPage.setData({
        [consignee]:item.name,
        [consigneePhone]:item.phone,
        [consigneeCompanyName]:item.consumerName,
        [consigneeProvince]:item.bookProvince,
        [consigneeProvinceName]:item.bookProvinceName,
        [consigneeCity]:item.bookCity,
        [consigneeCityName]:item.bookCityName,
        [consigneeDistrict]:item.bookDistrict,
        [consigneeDistrictName]:item.bookDistrictName,
        [consigneeStreet]:item.bookStreet,
        [consigneeStreetName]:item.bookStreetName,
        [consigneeDetailAddress]:item.bookAddress
      });
      prevPage.reciverUserInfo=Object.assign({}, prevPage.reciverUserInfo,item);
      prevPage.setData({
        reciverUserInfo:prevPage.reciverUserInfo
      });
      prevPage.getSortingCenterInfo('endSortCenter',item.bookStreet);
    }
    prevPage.onBtnIsActive();
    prevPage.getEstimateCost();
    prevPage.getFreightList();
    wx.navigateBack();
  }
})
