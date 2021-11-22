// pages/store_info/store_info.js

import {
  requst_get_shopDetail
} from '../../api/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopDetail: {},
    shopKey: [],
    select: '',
    listData: [],
    defaultImg:''
  },
  async getShopDetail(shopId) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let param = {
      shopId: shopId
    }
    let {
      data
    } = await requst_get_shopDetail(param)
    wx.hideLoading()
    if (data.code == '1001') {
      let shopDetail = data.data;
      let shopKey = Object.keys(shopDetail);
      this.setData({
        shopKey: shopKey,
        select: shopKey[0],
        shopDetail: shopDetail,
        listData: shopDetail[shopKey[0]]
      })
    }
  },
  menuItemClick(e) {
    let name = e.currentTarget.dataset.name;
    if (name != this.data.select) {
      this.setData({
        select: name,
        listData: this.data.shopDetail[name]
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let shopId = options.shopId;
    let name = options.name;
    let shopTypeId=options.shopTypeId;
    this.setData({
      defaultImg:shopTypeId==3?'https://sh1a.qingstor.com/sgx-96777-pro/2021-11-08/catering.png?access_key_id=DIHFNGPFGVICICBJSFKX&expires=1645003836&signature=B8V87XJJ6D9CV1jAXeXEBIEQsgWtDflzckF4q4yW1Uc%3D':shopTypeId==4?'https://sh1a.qingstor.com/sgx-96777-pro/2021-10-21/specialty.png?access_key_id=DIHFNGPFGVICICBJSFKX&expires=1643511311&signature=ANfjYocBvN2boxPfvbLE1dMWUmGPECiVhJ%2Fv6c1S0yg%3D':'https://sh1a.qingstor.com/sgx-96777-pro/2021-10-21/features.png?access_key_id=DIHFNGPFGVICICBJSFKX&expires=1643511309&signature=yZY0YMWO7sf9JyDdJDE8cCSZ0uwUlZL5AK%2B%2FTa9rAAI%3D'
    })
    wx.setNavigationBarTitle({
      title: name 
    })
    this.getShopDetail(shopId)
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