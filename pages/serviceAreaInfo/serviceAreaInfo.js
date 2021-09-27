// pages/serviceAreaInfo/serviceAreaInfo.js

import {
  requst_get_queryAllShop
} from '../../api/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceAreaItemInfo: {},
    listData: [], //列表数据
    pageNum: 1, //页码
    pageSize: 10, //页数
    total: 0 //列表总数
  },
  //获取当前服务区信息
  getserviceAreaItemInfo() {
    let serviceAreaItemInfo = wx.getStorageSync('serviceAreaItemInfo')
    if (serviceAreaItemInfo) {
      this.setData({
        serviceAreaItemInfo: serviceAreaItemInfo
      })
      wx.nextTick(()=>{
        this.getqueryAllShop()
      })
    }
  },
  //获取店铺
  async getqueryAllShop() {
    let wxData = this.data;
    let param = {
      serviceAreaId: wxData.serviceAreaItemInfo.serviceAreaId,
      pageNum: wxData.pageNum, //页码
      pageSize: wxData.pageSize, //页数
    };
    let {
      data
    } = await requst_get_queryAllShop(param)
    if (data.code == '1001') {
      let mapData = data.data.records;
      let newData = wxData.listData.concat(mapData);
      this.setData({
        listData: newData,
        total: data.data.total,
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
      this.getqueryAllShop()
    }
  },
  //店铺信息查询点击
  shopItemClick(e){
    let info=e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/store_info/store_info?shopId='+info.shopId+'&name='+info.shopParentName+'&shopTypeId='+info.shopTypeId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getserviceAreaItemInfo()
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