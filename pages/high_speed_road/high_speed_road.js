// pages/high_speed_road/high_speed_road.js
import {
  requst_get_queryAllRoadInfo,
  requst_get_queryRoadInfoDetail,
  requst_get_queryAllByDistance,
  requst_get_queryAllServiceAreaByDistanse
} from '../../api/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [], //列表数据
    pageNum: 1, //页码
    pageSize: 10, //页数
    total: 0, //列表总数
    searchText: '' //搜索条件
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  //查询条件
  bindconfirm(e) {
    this.setData({
      searchText: e.detail.value,
      pageNum: 1,
      listData: [],
      total: 0
    })
    wx.nextTick(() => {
      this.getData()
    })
  },
  //获取列表
  async getData() {
    let wxData = this.data;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let param = {
      pageNum: wxData.pageNum,
      pageSize: wxData.pageSize,
      searchText: wxData.searchText
    }
    let {
      data
    } = await requst_get_queryAllRoadInfo(param)
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
    }
  },
  confirm(e) {
    //设置缓存
    wx.setStorageSync('GsRoadInfo', e.detail)
    wx.navigateTo({
      url: '/pages/high_speed_info/high_speed_info',
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
      this.getData()
    }
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