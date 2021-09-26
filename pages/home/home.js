// pages/home/home.js
//获取应用实例
const app = getApp()
var amapFile = require('../../libs/amap-wx.130.js');
import {
  markersData
} from '../../libs/markers.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tollstationList: 4,
    city:'',
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height*2+20 ,   
  },
  entranceClick(e){
    let path=e.currentTarget.dataset.path;
    wx.navigateTo({
      url: '/pages/'+path+'/'+path,
    })
  console.log(e.currentTarget.dataset.path)
  },
  restrictionsWay() {
    wx.navigateTo({
      url: '/pages/restrictions/restrictions',
    })
  },
  entranceWay() {
    wx.navigateTo({
      url: '/pages/toll_station/toll_station',
    })
  },
  service_areaWay() {
    wx.navigateTo({
      url: '/pages/serviceArea/serviceArea',
    })
  },
  serviceAreaInfo() {
    wx.navigateTo({
      url: '/pages/serviceAreaInfo/serviceAreaInfo',
    })
  },
  getLocation: function () {
    var page = this;
    console.log(this.data.height)
    wx.getLocation({
      type: 'wgs84', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function (res) {
        // success
        var longitude = res.longitude
        var latitude = res.latitude;
        //设置地图
        wx.setStorageSync('myLocation', res);
        page.loadCity(longitude, latitude);
       
      },
      fail(err){
        console.log(err)
      }
    })
  },
  loadCity(longitude, latitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: markersData.key
    });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '', //location的格式为'经度,纬度'
      success: function (data) {
        let {regeocodeData}=data[0];
        that.setData({
          city:regeocodeData.addressComponent.city+regeocodeData.addressComponent.district//当前的城市
        })
      },
      fail: function (info) {}
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocation()
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