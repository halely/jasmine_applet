// pages/emergencyRescue/emergencyRescue.js
var amapFile = require('../../libs/amap-wx.130.js');
import {
  markersData
} from '../../libs/markers.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addreeInfoHide: false,
    center: [],
    addressName: '',
    myLocation: {},
    scale: 16, //缩放级别
    minScale: 3, //最小缩放级别
    maxScale: 20 //最大缩放级别
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let myLocation = wx.getStorageSync('myLocation');
    if (myLocation) {
      //设置中心点
      let center = [myLocation.longitude, myLocation.latitude];
      this.setData({
        center,
        myLocation
      })
    }
    
  },
  //地图缩放更改
  scaleChange(e) {
    let type = e.target.dataset.code;
    let _this = this;
    let {
      minScale,
      maxScale
    } = this.data;
    this.MapContext.getCenterLocation({
      success(res) {
        let center = [res.longitude, res.latitude];
        _this.setData({
          center
        })
        _this.MapContext.getScale({
          success(res) {
            let scale = Math.round(res.scale);
            if (type == 'add') {
              if (scale < maxScale) {
                scale = scale + 1;
              }
            } else if (type == 'reduce') {
              if (scale > minScale) {
                scale = scale - 1;
              }
            }
            _this.setData({
              scale
            })
          }
        })
      }
    })
  },
  // 实时获取当前位置
  // 这个函数 在 onLoad内触发 或 点击触发
  async location() {
    const that = this;
    try {
      await that.getWxLocation()
      this.MapContext.moveToLocation();
    } catch (error) {
      console.log(error)
      wx.showModal({
        title: '是否授权当前位置',
        content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
        success: function (res) {
          if (res.confirm) {
            that.toSetting()
          }
        }
      })
      return false;
    }
  },
  // 获取位置信息
  getWxLocation() {
    let _this = this;
    return new Promise((resolve, reject) => {
      const _locationChangeFn = (res) => {
        // console.log('location change', res);
        if (res.latitude && res.longitude) {
          _this.loadCity(res.longitude, res.latitude)
        }
        wx.offLocationChange(_locationChangeFn); //取消监听实时地理位置变化事件
      }
      wx.startLocationUpdate({
        success: (res) => {
          wx.onLocationChange(_locationChangeFn)
          resolve()
        },
        fail: (err) => {
          reject()
        }
      })
    })
  },
  //获取当前城市
  loadCity(longitude, latitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: markersData.key
    });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '', //location的格式为'经度,纬度'
      success: function (data) {

        let res = data[0];
        that.setData({
          addressName: res.name
        })
      },
      fail: function (info) {}
    });
  },
  // 调起客户端小程序设置界面
  toSetting() {
    let _this = this;
    wx.openSetting({
      success(res) {
        if (res.authSetting["scope.userLocation"]) {
          wx.showToast({
            title: '授权成功',
            icon: 'success',
            duration: 2000
          })
          _this.location()
        } else {
          wx.showToast({
            title: '未授权，无法获取当前位置',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  nextStep() {
    wx.navigateTo({
      url: '/pages/warmPrompt/warmPrompt',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //设置map
    this.MapContext = wx.createMapContext('mymap');
    this.location()
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