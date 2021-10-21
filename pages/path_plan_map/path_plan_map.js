// pages/path_plan_map/path_plan_map.js
var amapFile = require('../..//libs/amap-wx.130.js');
var config = require('../../libs/markers.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myLocation: {},
    markers: [],
    polyline: {},
    y:0,
    origin: {}, //起点
    destination: {} //目的地
  },
  //选择起点
  getFormAddress: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        let {
          address,
          latitude,
          longitude,
          name
        } = res;
        let origin = {
          name: name,
          address: address,
          latitude: latitude,
          longitude: longitude,
          iconPath: '/img/origin.png',
          width: 35,
          height: 40
        }
        that.setData({
          origin: origin,
        })
        that.getSure()
      },
      fail: function () {
        wx.showToast({
          title: '定位失败',
          icon: "none"
        })
      },
      complete: function () {
        //隐藏定位中信息进度
        wx.hideLoading()
      }
    })
  },
  //选择目的地
  getToAddress: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        let {
          address,
          latitude,
          longitude,
          name
        } = res;
        let destination = {
          name: name,
          address: address,
          latitude: latitude,
          longitude: longitude,
          iconPath: '/img/destination.png',
          width: 35,
          height: 40
        }
        that.setData({
          destination: destination,
        })
        that.getSure()
      },
      fail: function () {
        wx.showToast({
          title: '定位失败',
          icon: "none"
        })
      },
      complete: function () {
        //隐藏定位中信息进度
        wx.hideLoading()
      }
    })
  },
  /**
   * 确定
   */
  getSure: function () {
    var that = this;
    // 判断地址有没有都输入
    if(!(this.data.origin.longitude&&this.data.destination.longitude)) return false;
    var origin = that.data.origin.longitude + ',' + that.data.origin.latitude; //起点坐标
    var destination = that.data.destination.longitude + ',' + that.data.destination.latitude; //目的地坐标
    var key = config.markersData.key;
    var myAmapFun = new amapFile.AMapWX({
      key: key
    });
    myAmapFun.getDrivingRoute({
      origin: origin,
      destination: destination,
      success: function (data) {
        var points = [];
        let markers = [];
        markers.push(that.data.origin)
        markers.push(that.data.destination)
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          let sfzarr = [];
          let fwqarr = [];
          for (var i = 0; i < steps.length; i++) {
            let assistant_action = steps[i].assistant_action;
            var poLen = steps[i].polyline.split(';');

            if (assistant_action == '到达收费站') {
              let path = poLen[poLen.length - 1];
              markers.push({
                name: '收费站' + i,
                longitude: parseFloat(path.split(',')[0]),
                latitude: parseFloat(path.split(',')[1]),
                width: 20,
                height: 20,
                iconPath: '/img/stationIcon.png'
              })
              sfzarr.push(path);
            }
            if (assistant_action == '到达服务区') fwqarr.push(poLen[poLen.length - 1]);
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
          console.log(sfzarr)
          console.log(fwqarr)
        }
        that.setData({
          state: 1,
          markers: markers,
          polyline: [{
            points: points,
            arrowLine: true,
            color: "#07C160",
            width: 8
          }]
        });
        console.log(JSON.stringify(points))
      }
    })
  },
  // 切换地址
  switchPath(){
    let {origin,destination}=this.data;
    let temporary=JSON.parse(JSON.stringify(origin));
    origin=JSON.parse(JSON.stringify(destination));
    origin.iconPath='/img/origin.png';
    destination=temporary;
    temporary.iconPath='/img/destination.png';
    this.setData({
      origin:origin,
      destination:destination
    })
    this.getSure()
  },
  onPresent(e){
   console.log(e.detail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let myLocation = wx.getStorageSync('myLocation');
    let origin = {
      name: '当前位置',
      latitude: myLocation.latitude,
      longitude: myLocation.longitude,
      iconPath: '/img/origin.png',
      width: 35,
      height: 40
    }
    this.setData({
      myLocation: myLocation,
      origin: origin
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