// pages/high_speed_info/high_speed_info.js

import {
  requst_get_queryRoadInfoDetail,
  requst_get_queryAllByDistance,
  requst_get_queryAllServiceAreaByDistanse,
  requst_get_roadifSave,
  requst_post_myCollectionDelete,
  requst_post_myCollectionRoadInsert
} from '../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focusonState: false, //是否收藏
    current: 1,
    listData: [], //列表数据,三个模块复用一个数组
    roadType: 'all',
    pageNum: 1, //页码
    pageSize: 10, //页数
    total: 0, //列表总数
    GsRoadInfo: {}, //高速信息，上一个页面带过来的
    myLocation: {},
    newRoadDirList: [],
    loginStatus:false,
    roadDirId: '',
    collectionId: '', //收藏的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGsRoadInfo();
    this.getqueryRoadInfoDetail()
  },
  //获取缓存数据
  getGsRoadInfo() {
    let GsRoadInfo = wx.getStorageSync('GsRoadInfo');
    let myLocation = wx.getStorageSync('myLocation')
    if (GsRoadInfo) {
      //获取方向数组
      let newRoadDirList = GsRoadInfo.roadDirList.map(item => {
        item.dirDesName = item.dirDes.split('-')[0] + '方向';
        return item;
      })
      this.setData({
        GsRoadInfo,
        myLocation,
        newRoadDirList,
        roadDirId: newRoadDirList[0].roadDirId
      })
    }
  },
  //收藏点击
  focusonClick() {
    let token = wx.getStorageSync('access-token');
    if (!token) return;
    let {
      focusonState
    } = this.data;
    if (focusonState) {
      //取消收藏
      this.get_myCollectionDelete()
    }else{
       this.get_myCollectionRoadInsert()
    }
    
  },
  //删除收藏
  async get_myCollectionDelete(){
    let list=[];
    list.push(this.data.collectionId)
    let {data}=await requst_post_myCollectionDelete({
      list
    })
    if(data.code!='1001'){
      console.log('取消失败')
    }else{
      this.setData({
        focusonState: !this.data.focusonState
      })
    }
  },
  //添加收藏
  async get_myCollectionRoadInsert(){
    let {data:res}=await requst_post_myCollectionRoadInsert({
      roadId:this.data.GsRoadInfo.roadId
    })
    let {data,code}=res;
    if(code=='1001' && data){
      this.setData({
        focusonState: !this.data.focusonState,
        collectionId:data.collectionId
      })
    }
    
  },
  // tab类型切换
  tabClick(e) {
    let code = e.target.dataset.code;
    let {
      current,
      newRoadDirList
    } = this.data;
    if (current && current != code) {
      this.setData({
        current: code,
        roadType: 'all',
        pageNum: 1,
        total: 0, //列表总数
        roadDirId: newRoadDirList[0].roadDirId,
        listData: []
      })
      if (code == 1) {
        this.getqueryRoadInfoDetail()
      } else if (code == 2) {
        this.getQueryAllByDistance()
      } else {
        this.getQueryAllServiceAreaByDistanse()
      }
    }
  },
  //路况类型选择
  roadTypeClick(e) {
    let code = e.target.dataset.code;
    let roadType = this.data.roadType;
    if (code && code != roadType) {
      this.setData({
        roadType: code,
        pageNum: 1,
        listData: [],
        total: 0
      })
      wx.nextTick(() => {
        this.getqueryRoadInfoDetail()
      })
    }
  },
  //监听滚动
  scrolltolower() {
    let wxData = this.data;
    if (wxData.listData.length < wxData.total) {
      let pageNum = wxData.pageNum += 1;
      this.setData({
        pageNum: pageNum
      })
      if (wxData.current == 1) {
        this.getqueryRoadInfoDetail()
      } else if (wxData.current == 2) {
        this.getQueryAllByDistance()
      } else {
        this.getQueryAllServiceAreaByDistanse()
      }
    }
  },
  // 获取路况信息
  async getqueryRoadInfoDetail() {
    let wxData = this.data;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let param = {
      pageNum: wxData.pageNum,
      pageSize: wxData.pageSize,
      roadId: wxData.GsRoadInfo.roadId,
      type: wxData.roadType == 'all' ? '' : wxData.roadType
    }
    let {
      data
    } = await requst_get_queryRoadInfoDetail(param)
    wx.hideLoading()
    if (data.code == '1001') {
      let newData = wxData.listData.concat(data.data.records);
      this.setData({
        listData: newData,
        total: data.data.total,
      })
    }
  },
  //获取收费站
  async getQueryAllByDistance() {
    let wxData = this.data;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let param = {
      pageNum: wxData.pageNum,
      pageSize: wxData.pageSize,
      jd: wxData.myLocation.longitude,
      wd: wxData.myLocation.latitude,
      roadId: wxData.GsRoadInfo.roadId,
      roadDirId: wxData.roadDirId
    }
    let {
      data
    } = await requst_get_queryAllByDistance(param)
    wx.hideLoading()
    if (data.code == '1001') {
      let mapData = data.data.records;
      let newData = wxData.listData.concat(mapData);
      this.setData({
        listData: newData,
        total: data.data.total,
      })
    }
  },
  //获取服务区
  async getQueryAllServiceAreaByDistanse() {
    let wxData = this.data;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let param = {
      pageNum: wxData.pageNum,
      pageSize: wxData.pageSize,
      jd: wxData.myLocation.longitude,
      wd: wxData.myLocation.latitude,
      roadId: wxData.GsRoadInfo.roadId,
      roadDirId: wxData.roadDirId
    }
    let {
      data
    } = await requst_get_queryAllServiceAreaByDistanse(param)
    wx.hideLoading()
    if (data.code == '1001') {
      let mapData = data.data.records;
      let newData = wxData.listData.concat(mapData);
      this.setData({
        listData: newData,
        total: data.data.total,
      })
    }
  },
  //切换方向
  RoadDirClick(e) {
    let {
      roadDirId,
      current
    } = this.data
    let code = e.target.dataset.code;
    if (code && code != roadDirId) {
      this.setData({
        pageNum: 1,
        total: 0, //列表总数
        roadDirId: code,
        listData: []
      })
      if (current == 2) {
        this.getQueryAllByDistance()
      } else {
        this.getQueryAllServiceAreaByDistanse()
      }
    }
  },
  //地图模式
  toMap(e) {
    wx.navigateTo({
      url: '/pages/high_speed_map/high_speed_map',
    })
  },
  //查询是否已经收藏
  async getroadifSave() {
    let token = wx.getStorageSync('access-token');
    if (!token) return;
    let GsRoadInfo = wx.getStorageSync('GsRoadInfo');
    let {
      data: res
    } = await requst_get_roadifSave({
      roadId: GsRoadInfo.roadId
    })
    if (res.code == 1001) {
      if (res.data) {
        this.setData({
          collectionId: res.data.collectionId,
          focusonState: true
        })
      }else{
        this.setData({
          collectionId:'',
          focusonState: false
        })
      }
    }
    //如果没有收藏，返回的为null

  },
  islogin() {
    let accessToken = wx.getStorageSync('access-token')
    this.setData({
      loginStatus: accessToken ? true : false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getroadifSave();
    this.islogin()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})