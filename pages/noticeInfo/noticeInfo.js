// pages/noticeInfo/noticeInfo.js
import {
  requst_get_queryHandyNotice
} from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [], //列表数据
    pageNum: 1, //页码
    pageSize: 10, //页数
    total: 0, //列表总数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  //列表查询
  async getData() {
    let wxData = this.data;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let param = {
      pageNum: wxData.pageNum,
      pageSize: wxData.pageSize
    }
    let {
      data
    } = await requst_get_queryHandyNotice(param)
    wx.hideLoading()
    if (data.code == '1001') {
      let mapData = data.data.records;
      let newData = wxData.listData.concat(mapData);
      this.setData({
        listData: newData,
        total: data.data.total,
      })
    }
    wx.hideNavigationBarLoading();
    //停止下拉刷新
    wx.stopPullDownRefresh();
  },
  itemClick(e) {
    let index = e.currentTarget.dataset.index;
    wx.setStorageSync('articleData', this.data.listData[index])
    wx.navigateTo({
      url: '/pages/articleView/articleView?type=notice',
    })
  },
  //刷新
  onRefresh() {
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    this.setData({
      listData: [], //列表数据
      pageNum: 1, //页码
      pageSize: 10, //页数
      total: 0, //列表总数
    })
    this.getData();
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
    this.onRefresh();
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