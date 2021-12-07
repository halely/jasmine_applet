// home/home.js
const app = getApp()
var amapFile = require('../../libs/amap-wx.130.js');
import {
  markersData
} from '../../libs/markers.js'

import {
  requst_get_queryHandyNotice
} from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    islocation: false, //当前是否获取位置
    city: '', //当前城市
    height: app.globalData.height * 2 + 10, //手机高度
    applyList: app.globalData.applyList,//应用数据存在全局变量中，因为其他页面也需要
    defaultselectList: ['收费站', '过江通道', 'ETC发票', '紧急救援'], //默认项
    selectView: [],
    current: 0, //动态index
    packupShow: false, //输入地址
    origin: {}, //起点
    center: [118.737087,31.989091],
    destination: {}, //目的地
    scale: 16, //缩放级别
    minScale: 3, //最小缩放级别
    maxScale: 20, //最大缩放级别
    listDate: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocation();
    this.getqueryHandyNotice();
  },
  //设置展示项applyList数据
  setapplyList() {
    let wxData = this.data;
    //先获取缓存应用项
    let defaultselectList = wx.getStorageSync('defaultselectList');
    //如果没有就调用默认值
    if (!defaultselectList || !defaultselectList.length) defaultselectList = wxData.defaultselectList;
    this.setData({
      defaultselectList
    })
    let applyList = wxData.applyList; //所有应用项
    //根据defaultselectList设置applyList
    let selectView = [];
    //顺序生成应用数组
    defaultselectList.forEach(item => {
      applyList.find((elm,index) => {
        if(elm.name == item){
          elm.selected = true;
          elm.indexKey=index;
          selectView.push(elm);
          return true;
        }
        return false;
      })
    })
    this.setData({
      applyList,
      selectView
    })
  },
  //选择起点
  getFormAddress: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        let {
          address,
          latitude,
          longitude,
          name
        } = res;
        if (!address) return false;
        let origin = {
          name: name,
          latitude: latitude,
          longitude: longitude,
          addressName: name,
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
        if (!address) return false;
        let destination = {
          name: name,
          latitude: latitude,
          addressName: name,
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
  // 切换地址
  switchPath() {
    let {
      origin,
      destination
    } = this.data;
    let temporary = JSON.parse(JSON.stringify(origin));
    origin = JSON.parse(JSON.stringify(destination));
    origin.iconPath = '/img/origin.png';
    destination = temporary;
    temporary.iconPath = '/img/destination.png';
    this.setData({
      origin: origin,
      destination: destination
    })
    this.getSure()
  },
  //确定查询地址
  getSure: function () {
    var that = this;
    // 判断地址有没有都输入
    if (!(this.data.origin.longitude && this.data.destination.longitude)) return false;
    let pathObj = {
      origin: this.data.origin,
      destination: this.data.destination
    }
    wx.setStorageSync('pathObj', pathObj)
    wx.navigateTo({
      url: '/pages/path_plan_map/path_plan_map',
    })
  },
  //跳转下一页
  jumpView() {
    let current = this.data.current;
  },
  // 开启地址输入
  packupFc() {
    let {
      packupShow
    } = this.data;
    this.setData({
      packupShow: !packupShow
    })
  },
  //走马灯index
  bindchange(e) {
    this.setData({
      current: e.detail.current
    })
  },
  noticeView(){
    let current=this.data.current;
    if(!this.data.listDate.length) return false;
    wx.setStorageSync('articleData', this.data.listDate[current])
    wx.navigateTo({
      url: '/pages/articleView/articleView?type=notice',
    })
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
  //回到当前位置
  nearView() {
    let myLocation = wx.getStorageSync('myLocation')
    if (myLocation) {
      this.MapContext.moveToLocation();
    }
  },
  // 实时获取当前位置
  async onLocationChange() {
    let self = this
    try {
      await this.getWxLocation() //等待
    } catch (error) {
      self.chooselocation();
      return false;
    }
  },
  getWxLocation() {
    wx.showLoading({
      title: '定位中...',
      mask: true,
    })
    return new Promise((resolve, reject) => {
      let _locationChangeFn = (res) => {
        console.log('location change', res)
        wx.hideLoading();
        if (res.latitude) {
          let {
            latitude,
            longitude
          } = res;
          this.loadCity(longitude, latitude)
        }
        wx.offLocationChange(_locationChangeFn)
      }
      wx.startLocationUpdate({
        success: (res) => {
          wx.onLocationChange(_locationChangeFn)
          resolve()
        },
        fail: (err) => {
          console.log('获取当前位置失败', err)
          wx.hideLoading()
          reject()
        }
      })
    })
  },
  //获取当前位置
  getLocation() {
    var _this = this;
    wx.getLocation({
      type: 'wgs84', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function (res) {
        let {
          longitude,
          latitude
        } = res;
        //设置地图
        _this.setData({
          islocation: true,
          center:[longitude,latitude]
        })
        _this.loadCity(longitude, latitude);
      },
      fail(err) {
        wx.getSetting({
          success: function (res) {
            //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
            if (res.authSetting['scope.userLocation']) {
              wx.showModal({
                title: '',
                content: '定位失败，请检查网络环境或手机定位权限',
                mask: true,
                confirmText: '重新定位',
                confirmColor: '#07C160',
                success: function (res) {
                  if (res.confirm) {
                    _this.chooselocation()
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
        let myLocation = {
          latitude: latitude,
          longitude: longitude,
          city: regeocodeData.addressComponent.city,
          township: regeocodeData.addressComponent.township
        }
        if (that.MapContext) {
          that.MapContext.moveToLocation();
        }
        //设置地图缓存
        wx.setStorageSync('myLocation', myLocation);
        let origin = {
          name: '当前位置',
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          addressName: myLocation.township,
          iconPath: '/img/origin.png',
          width: 35,
          height: 40
        }
        that.setData({
          city: regeocodeData.addressComponent.city + regeocodeData.addressComponent.district, //当前的城市
          origin: origin
        })
      },
      fail: function (info) {}
    });
  },
  //授权小程序
  chooselocation() {
    var _this = this;
    wx.getSetting({
      success: (res) => {
        let userLocation = res.authSetting['scope.userLocation'];
        //未授权的时候
        if (userLocation != undefined && !userLocation) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 2000
                      })
                      //再次授权，调用getLocationt的API
                      _this.getLocation()
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
        } else {
          _this.getLocation()
        }
      }
    })
  },
  //点击主体跳转
  entranceClick(e) {
    let myLocation = wx.getStorageSync('myLocation')
    if (!myLocation) {
      wx.showToast({
        title: '请授权获取当前位置',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let path = e.currentTarget.dataset.path;
    if(!path) {
      // wx.navigateToMiniProgram({
      //   shortLink: '#小程序://美团团购丨优选外卖单车美食酒店/美团/r2hWwM1HTe2fHFb',
      //   success(res) {
      //     // 打开成功
      //   }
      // })
      return false;
    }
    wx.navigateTo({
      url: '/pages/' + path + '/' + path,
    })
  },
  //获取公告信息
  async getqueryHandyNotice() {
    let param = {
      pageNum: 1,
      pageSize: 3
    }
    let {
      data
    } = await requst_get_queryHandyNotice(param);
    if (data.code == '1001') {
      this.setData({
        listDate: data.data.records
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //设置map
    this.MapContext = wx.createMapContext('mymap');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setapplyList();
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