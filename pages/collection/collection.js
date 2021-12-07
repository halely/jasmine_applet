// pages/collection/collection.js

import {
  requst_get_myCollectionRoad,
  requst_get_myCollectionStation,
  requst_get_myCollectionServiceArea,
  requst_get_myCollectionLine,
  requst_post_myCollectionDelete
} from '../../api/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: '1',
    array: [{
      code: '',
      text: "全部时间"
    }, {
      code: '1',
      text: "最近一个月"
    }, {
      code: '3',
      text: "最近三个月"
    }, {
      code: '6',
      text: "最近六个月"
    }],
    arrayindex: 0,
    managementStats: false, //是否点击了管理
    searchType: '',
    listData: [], //列表数据
    pageNum: 1, //页码
    pageSize: 10, //页数
    total: 0, //列表总数
    myLocation: null,
    selecteArr: [], //选中的索引值数组
    allselecte: false, //全选
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取类型
    let myLocation = wx.getStorageSync('myLocation');
    this.setData({
      myLocation,
      current: options.code
    })

  },
  //监听滚动
  scrolltolower() {
    let wxData = this.data;
    if (wxData.listData.length < wxData.total) {
      let pageNum = wxData.pageNum += 1;
      this.setData({
        pageNum: pageNum
      })
      let code = this.data.current;
      switch (code) {
        case '1':
          this.get_myCollectionRoad(); //高速
          break;
        case '2':
          this.get_myCollectionStation(); //收费站
          break;
        case '3':
          this.get_myCollectionServiceArea(); //服务区
          break;
        default:
          this.get_myCollectionLine(); //路线
      }
    }
  },
  //列表调用
  setcurrent(code) {
    this.setData({
      current: code,
      searchType: '',
      arrayindex: 0,
    })
    this.restore()
  },
  //类型切换
  tabClick(e) {
    let code = e.target.dataset.code;
    let current = this.data.current;
    if (code && code != current) {
      this.setcurrent(code);
    }
  },
  //时间选择
  bindPickerChange: function (e) {
    let {
      array,
      current
    } = this.data;
    this.setData({
      listData: [],
      pageNum: 1,
      total: 0,
      searchType: array[e.detail.value].code,
      arrayindex: e.detail.value
    })
    wx.nextTick(() => {
      this.restore()
    })

  },
  //管理变更
  managementClick() {
    let state = this.data.managementStats;
    this.setData({
      managementStats: !state
    })
  },
  itemClick(e) {
    if (!this.data.managementStats) return false;
    let {
      selecteArr,
      listData
    } = this.data;
    let code = e.currentTarget.dataset.index;
    let index = selecteArr.indexOf(code);
    if (index == '-1') {
      selecteArr.push(code);
    } else {
      selecteArr.splice(index, 1)
    }
    let allselecte = false;
    if (listData.length) {
      allselecte = listData.length == selecteArr.length
    }
    this.setData({
      selecteArr,
      allselecte
    })
  },
  //全选点击
  allClick() {
    let {
      listData,
      allselecte
    } = this.data;
    if (allselecte) {
      this.setData({
        selecteArr: [],
        allselecte: false
      })
    } else {
      let selecteArr = listData.map((item, index) => {
        return index
      })
      this.setData({
        selecteArr,
        allselecte: true
      })
    }
  },
  confirmRoad(e) {
    //设置缓存
    if (this.data.managementStats) return false;
    wx.setStorageSync('GsRoadInfo', e.detail)
    wx.navigateTo({
      url: '/pages/high_speed_info/high_speed_info',
    })
  },
  //收藏服务区跳转
  servicecollectItemView(e) {
    //设置缓存
    if (this.data.managementStats) return false;
    wx.setStorageSync('serviceAreaItemInfo', e.currentTarget.dataset.info);
    wx.navigateTo({
      url: '/pages/serviceAreaInfo/serviceAreaInfo',
    })
  },
  //收藏路线跳转
  collectItemView(e) {
    let code = e.currentTarget.dataset.index;
    let {
      listData,
      managementStats
    } = this.data;
    if (managementStats) return false;
    this.jumpPath(listData[code])
  },
  jumpPath(item) {
    let origin = {
      name: item.startPlaceName,
      latitude: item.startGdLatitude,
      longitude: item.startGdLongitude,
      addressName: item.startPlaceName,
      iconPath: '/img/origin.png',
      width: 35,
      height: 40
    }
    let destination = {
      name: item.endPlaceName,
      latitude: item.endGdLatitude,
      addressName: item.endPlaceName,
      longitude: item.endGdLongitude,
      iconPath: '/img/destination.png',
      width: 35,
      height: 40
    }
    let pathObj = {
      origin,
      destination
    }
    wx.setStorageSync('pathObj', pathObj)
    wx.navigateTo({
      url: '/pages/path_plan_map/path_plan_map',
    })
  },
  //我的收藏-高速
  async get_myCollectionRoad() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let wxData = this.data;
    let param = {
      pageNum: wxData.pageNum,
      pageSize: wxData.pageSize,
      searchType: wxData.searchType
    }
    let {
      data
    } = await requst_get_myCollectionRoad(param)
    wx.hideLoading()
    if (data.code == '1001') {
      let mapData = data.data.records.map(item => {
        let obj = item;
        obj.name_type = item.roadId.slice(0, 1);
        obj.count = item.roadEventTipsList.reduce((sum, item) => sum + item.count, 0);
        if (item.roadId.length > 3) {
          obj.startroad = item.roadId.slice(0, 3);
          obj.endroad = item.roadId.slice(3);
        }
        return obj;
      })
      let newData = wxData.listData.concat(mapData);
      this.setData({
        listData: newData,
        total: data.data.total,
      })
    } else {
      wx.showToast({
        title: '数据获取失败',
        icon: 'none',
        duration: 1500,
        mask: true
      })
    }
  },
  //我的收藏-收费站
  async get_myCollectionStation() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let wxData = this.data;
    let param = {
      pageNum: wxData.pageNum,
      pageSize: wxData.pageSize,
      jd: wxData.myLocation.longitude,
      wd: wxData.myLocation.latitude,
      searchType: wxData.searchType
    }
    let {
      data
    } = await requst_get_myCollectionStation(param)
    wx.hideLoading()
    if (data.code == '1001') {
      let newData = wxData.listData.concat(data.data.records);
      this.setData({
        listData: newData,
        total: data.data.total,
      })
    } else {
      wx.showToast({
        title: '数据获取失败',
        icon: 'none',
        duration: 1500,
        mask: true
      })
    }
  },
  //我的收藏-服务区
  async get_myCollectionServiceArea() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let wxData = this.data;
    let param = {
      pageNum: wxData.pageNum,
      pageSize: wxData.pageSize,
      jd: wxData.myLocation.longitude,
      wd: wxData.myLocation.latitude,
      searchType: wxData.searchType
    }
    let {
      data
    } = await requst_get_myCollectionServiceArea(param)
    wx.hideLoading()
    if (data.code == '1001') {
      let newData = wxData.listData.concat(data.data.records);
      this.setData({
        listData: newData,
        total: data.data.total,
      })
    } else {
      wx.showToast({
        title: '数据获取失败',
        icon: 'none',
        duration: 1500,
        mask: true
      })
    }
  },
  //我的收藏-路线
  async get_myCollectionLine() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let wxData = this.data;
    let param = {
      pageNum: wxData.pageNum,
      pageSize: wxData.pageSize,
      searchType: wxData.searchType
    }
    let {
      data
    } = await requst_get_myCollectionLine(param)
    wx.hideLoading()
    if (data.code == '1001') {
      let newData = wxData.listData.concat(data.data.records);
      this.setData({
        listData: newData,
        total: data.data.total,
      })
    } else {
      wx.showToast({
        title: '数据获取失败',
        icon: 'none',
        duration: 1500,
        mask: true
      })
    }
  },
  //调用删除
  deleteAll() {
    let _this = this;
    let {
      listData,
      selecteArr
    } = _this.data;
    if (!selecteArr.length) {
      wx.showToast({
        title: '请选择删除项',
        icon: 'none'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请确定是否删除',
        success(res) {
          if (res.confirm) {
            let list = [];
            selecteArr.forEach(item => {
              list.push(listData[item].collectionId)
            })
            //开始删除
            _this.post_myCollectionDelete(list)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }
  },
  //删除方法
  async post_myCollectionDelete(list) {
    let {
      data
    } = await requst_post_myCollectionDelete({
      list
    })
    if (data.code == '1001') {
      wx.showToast({
        title: '删除成功',
        icon: 'none'
      })
      this.restore();

    }
  },
  //选中恢复x
  selectedrestore() {
    this.setData({
      managementStats: false, //是否点击了管理
      selecteArr: [], //选中的索引值数组
      allselecte: false, //全选
    })
  },
  //恢复公共数据
  restore() {
    this.setData({
      managementStats: false, //是否点击了管理
      listData: [],
      pageNum: 1,
      total: 0, //列表总数
      selecteArr: [], //选中的索引值数组
      allselecte: false, //全选
    })
    wx.nextTick(() => {
      let code = this.data.current;
      switch (code) {
        case '1':
          this.get_myCollectionRoad(); //高速
          break;
        case '2':
          this.get_myCollectionStation(); //收费站
          break;
        case '3':
          this.get_myCollectionServiceArea(); //服务区
          break;
        default:
          this.get_myCollectionLine(); //路线
      }
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
    this.setcurrent(this.data.current);
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