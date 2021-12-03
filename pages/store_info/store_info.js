// pages/store_info/store_info.js

import {
  requst_get_shopDetail,
  requst_get_getAllCommodityType
} from '../../api/index.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopDetail: {},
    shopKey: [],
    shopId: '',
    select: null,
    listData: [],
    pageNum: 1, //页码
    pageSize: 10, //页数
    total: 0, //列表总数
    defaultImg: ''
  },
  //获取店铺信息
  async getShopDetail() {
    let wxData = this.data;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let param = {
      shopId: wxData.shopId,
      pageNum: wxData.pageNum,
      pageSize: wxData.pageSize,
      commodityTypeId: wxData.select.commodityTypeId
    }
    let {
      data
    } = await requst_get_shopDetail(param)
    wx.hideLoading()
    if (data.code == '1001') {
      let mapData = data.data.jasmineCommodityListList[0].jasmineCommodityList;
      let newData = wxData.listData.concat(mapData);
      this.setData({
        listData: newData,
        total: data.data.jasmineCommodityListNum,
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
      this.getShopDetail()
    }
  },
  menuItemClick(e) {
    let item = e.currentTarget.dataset.item;
    if (this.data.select.commodityTypeId != item.commodityTypeId) {
      this.setData({
        select: item,
        listData: [],
        pageNum: 1, //页码
        pageSize: 10 //页数
      })
      this.getShopDetail()
    }
  },
  //获取该店铺下所有商品类型
  async getAllCommodityType(shopId) {
    let {
      data
    } = await requst_get_getAllCommodityType({
      shopId: shopId
    })
    if (data.code == '1001') {
      if (data.data.length) {
        this.setData({
          shopKey: data.data,
          select: data.data[0]
        })
        this.getShopDetail()
      }

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let shopId = options.shopId;
    let name = options.name;
    let shopTypeId = options.shopTypeId;
    this.setData({
      defaultImg: shopTypeId == 3 ? 'https://sh1a.qingstor.com/sgx-96777-pro/2021-11-08/catering.png?access_key_id=DIHFNGPFGVICICBJSFKX&expires=1645003836&signature=B8V87XJJ6D9CV1jAXeXEBIEQsgWtDflzckF4q4yW1Uc%3D' : shopTypeId == 4 ? 'https://sh1a.qingstor.com/sgx-96777-pro/2021-10-21/specialty.png?access_key_id=DIHFNGPFGVICICBJSFKX&expires=1643511311&signature=ANfjYocBvN2boxPfvbLE1dMWUmGPECiVhJ%2Fv6c1S0yg%3D' : 'https://sh1a.qingstor.com/sgx-96777-pro/2021-10-21/features.png?access_key_id=DIHFNGPFGVICICBJSFKX&expires=1643511309&signature=yZY0YMWO7sf9JyDdJDE8cCSZ0uwUlZL5AK%2B%2FTa9rAAI%3D',
      shopId: shopId
    })
    wx.setNavigationBarTitle({
      title: name
    })
    this.getAllCommodityType(shopId)
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