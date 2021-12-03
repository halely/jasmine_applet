// pages/serviceAreaInfo/serviceAreaInfo.js

import {
  requst_get_queryAllShop,
  requst_get_serviceAreaxist,
  requst_post_myCollectionDelete,
  requst_post_myCollectionserviceAreaInsert
} from '../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceAreaItemInfo: {},
    collectionId: '',
    current: 'all',
    listData: [], //列表数据
    pageNum: 1, //页码
    pageSize: 10, //页数
    total: 0 //列表总数
  },
  //店铺类型点击
  supermarketClick(e) {
    let wxData = this.data;
    let current = e.target.dataset.current;
    if (current) {
      if (wxData.current != current) {
        this.setData({
          current,
          listData: [],
          pageNum: 1, //页码
          pageSize: 10, //页数
        })
        wx.nextTick(() => {
          this.getqueryAllShop()
        })
      }
    }
  },
  //获取当前服务区信息
  getserviceAreaItemInfo() {
    let serviceAreaItemInfo = wx.getStorageSync('serviceAreaItemInfo')
    if (serviceAreaItemInfo) {
      this.setData({
        serviceAreaItemInfo: serviceAreaItemInfo
      })
      wx.nextTick(() => {
        this.getqueryAllShop()
      })
    }
  },
  //获取店铺
  async getqueryAllShop() {
    let wxData = this.data;
    if (!wxData.serviceAreaItemInfo.fwqSystemServiceAreaId && !wxData.serviceAreaItemInfo.fwqSystemDistributionId) {
      return false;
    }
    let param = {
      restAreaId: wxData.serviceAreaItemInfo.fwqSystemServiceAreaId,
      distributionId: wxData.serviceAreaItemInfo.fwqSystemDistributionId,
      shopTypeId: wxData.current == 'all' ? '' : wxData.current,
      pageNum: wxData.pageNum, //页码
      pageSize: wxData.pageSize, //页数
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let {
      data
    } = await requst_get_queryAllShop(param)
    wx.hideLoading()
    if (data.code == '1001') {
      let mapData = data.data.jasmineShopListList;
      let newData = wxData.listData.concat(mapData);
      this.setData({
        listData: newData,
        total: data.data.jasmineShopListNum,
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
  shopItemClick(e) {
    let info = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/store_info/store_info?shopId=' + info.jasmineShopList[0].shopId + '&name=' + info.jasmineShopList[0].shopParentName + '&shopTypeId=' + info.shopTypeId,
    })
  },
  //判断服务区是否收藏
  async getServiceAreaxist() {
    let accessToken = wx.getStorageSync('access-token')
    let serviceAreaItemInfo = wx.getStorageSync('serviceAreaItemInfo');
    if (accessToken) {
      let serviceAreaId = serviceAreaItemInfo.serviceAreaId;
      let {
        data
      } = await requst_get_serviceAreaxist({
        serviceAreaId
      })
      if (data.code == '1001') {
        let collectionId = ""
        if (data.data) {
          collectionId = data.data.collectionId || '';
        }
        this.setData({
          collectionId
        })
      }
    }
  },
  //点击收藏
  focusonClick() {
    let accessToken = wx.getStorageSync('access-token');
    if (!accessToken) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }
    let {
      collectionId
    } = this.data;
    if (collectionId) {
      this.get_myCollectionDelete([collectionId]).then(res => {
        if (res.code == '1001') {
          this.setData({
            collectionId: ''
          })
        } else {
          wx.showToast({
            title: '取消收藏失败',
            icon: "none"
          })
        }
      })
    } else {
      this.AddCollection()
    }
  },
  //添加收藏
  async AddCollection() {
    let serviceAreaItemInfo = wx.getStorageSync('serviceAreaItemInfo');
    let {
      data
    } = await requst_post_myCollectionserviceAreaInsert({
      serviceAreaId: serviceAreaItemInfo.serviceAreaId
    });
    if (data.code == '1001' && data.data.collectionId) {
      this.setData({
        collectionId: data.data.collectionId
      })
    }
  },
  //删除收藏
  get_myCollectionDelete(list) {
    return new Promise(async (resolve, reject) => {
      let {
        data
      } = await requst_post_myCollectionDelete({
        list
      })
      if (data.code == '1001') {
        resolve(data);
      } else {
        reject(data)
        wx.showToast({
          title: '收藏失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getserviceAreaItemInfo();
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
    this.getServiceAreaxist()
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