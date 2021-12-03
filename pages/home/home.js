// pages/home/home.js
//获取应用实例
const app = getApp()
var amapFile = require('../../libs/amap-wx.130.js');
import {
  markersData
} from '../../libs/markers.js'
import {
  requst_get_queryAllServiceAreaByDistanse, //服务区数据
  requst_get_queryAllByDistance //收费站数据
} from '../../api/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tollstationList: 4,
    city: '',
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    ServiceAreaData: {}, //服务区数据
    DistanceData: {}, //收费站数据
    current: 0,
    islocation: false
  },
  //点击主体
  entranceClick(e) {
    if (!this.data.islocation) {
      wx.showToast({
        title: '请授权获取当前位置',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: '/pages/' + path + '/' + path,
    })
  },
  moreBut() {
    if (!this.data.islocation) {
      wx.showToast({
        title: '请授权获取当前位置',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (this.data.current == 0) {
      wx.navigateTo({
        url: '/pages/toll_station/toll_station',
      })
    } else {
      wx.navigateTo({
        url: '/pages/serviceArea/serviceArea',
      })

    }
  },
  //服务区点击
  serviceAreaView() {
    //设置缓存
    wx.setStorageSync('serviceAreaItemInfo', this.data.ServiceAreaData);
    wx.navigateTo({
      url: '/pages/serviceAreaInfo/serviceAreaInfo',
    })
  },
  //评价
  evaluationClick() {
    wx.navigateTo({
      url: '/pages/evaluation/evaluation',
    })
  },
  currentChange(e) {
    let current = e.currentTarget.dataset.id;
    if (current != this.data.current) {
      this.setData({
        current: current
      })
    }
  },
  chooselocation() {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function (res) {
              if (res.cancel) {
                console.info("授权失败返回数据");
              } else if (res.confirm) {
                //that.open();
                wx.openSetting({
                  success: function (data) {

                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 2000
                      })
                      //再次授权，调用getLocationt的API
                      that.getLocation()
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 2000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
          that.getLocation()
        } else if (res.authSetting['scope.userLocation'] == true) {
          that.getLocation()
        }
      },
      fail(err){
      },
    })
  },
  //获取当前位置
  getLocation() {
    var page = this;
    wx.getLocation({
      type: 'wgs84', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function (res) {
        // success
        var longitude = res.longitude
        var latitude = res.latitude;
        //设置地图
       
        page.setData({
          islocation: true
        })
        page.loadCity(longitude, latitude);
        
      },
      fail(err) {
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userLocation']) {
              //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
              wx.showModal({
                title: '',
                content: '定位失败，请检查网络环境或手机定位权限',
                mask:true,
                confirmText: '重新定位',
                confirmColor:'#07C160',
                success: function (res) {
                  if (res.confirm) {
                    page.chooselocation()
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }             
                }
              })
            }
          }
        })
      }
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
        let {
          regeocodeData
        } = data[0];
        let myLocation={
          latitude:latitude,
          longitude:longitude,
          city:regeocodeData.addressComponent.city,
          township:regeocodeData.addressComponent.township
        }
        //设置地图缓存
        wx.setStorageSync('myLocation', myLocation);
        that.setData({
          city: regeocodeData.addressComponent.city + regeocodeData.addressComponent.district //当前的城市
        })
        that.getDatalist()
      },
      fail: function (info) {}
    });
  },
  getDatalist() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    Promise.all([this.getServiceArea(), this.getDistance()]).then(res => {
      wx.hideLoading()
    })
  },
  //获取服务区信息
  async getServiceArea() {
    let param = {
      pageNum: 1,
      pageSize: 1,
      searchText: '',
      jd: wx.getStorageSync('myLocation').longitude, //经度
      wd: wx.getStorageSync('myLocation').latitude, //纬度
      distanse: '', //距离
      cityId: '', //城市
      roadId: '', //路线
      searchText: ''
    }
    let {
      data
    } = await requst_get_queryAllServiceAreaByDistanse(param)
    if (data.code == '1001') {
      let mapData = data.data.records;
      this.setData({
        ServiceAreaData: mapData[0]
      })
    }
  },
  //获取收费站信息
  async getDistance() {
    let param = {
      pageNum: 1,
      jd: wx.getStorageSync('myLocation').longitude, //经度
      wd: wx.getStorageSync('myLocation').latitude, //纬度
      pageSize: 1,
      searchText: ''
    }
    let {
      data
    } = await requst_get_queryAllByDistance(param)
    if (data.code == '1001') {
      let mapData = data.data.records;
      this.setData({
        DistanceData: mapData[0]
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocation();
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