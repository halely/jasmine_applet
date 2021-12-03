// pages/traffic_info/traffic_info.js

import {
  requst_get_queryAllRoadInfo,
  requst_get_queryRoadInfoDetail,
  requst_get_queryAllByDistance,
  requst_get_queryAllServiceAreaByDistanse
} from '../../api/index.js'
Page({
  /**
   * 页面的初始数据
   */
  // {
  //   code: 2,
  //   icon: '/img/corssbridge.png',
  //   name: '过江大桥',
  //   hide: false,
  // },
  data: {
    center: [],
    scale: 10,
    roadMarkers: [], //路况信息列表
    tollStationMarkers: [], //收费站信息列表
    serviceAreaMarkers: [], //服务区信息列表
    markers: [],
    markerTypeList: [{
      code: 1,
      icon: '/img/road.png',
      name: '路况',
      hide: false,
    },  {
      code: 3,
      icon: '/img/stationIcon.png',
      name: '收费站',
      hide: false,
    }, {
      code: 4,
      icon: '/img/serviceAreaIcon.png',
      name: '服务区',
      hide: false,
    }],
    itemData: {},
    markerhideTypeList: [],
    IsMarkerinfoShow: false, //底部弹窗是否显示
    GsList: [] //高速信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let myLocation=wx.getStorageSync('myLocation')
    this.setData({
      center:[myLocation.longitude,myLocation.latitude]
    })
    this.getgsData();
    this.getMarker();
  },
  //描点点击
  bindmarkertap(e) {
    let markerId = e.markerId;
    if(!markerId) return false;
    let markers = this.data.markers;
    let itemData = {}
    markers.forEach(item => {
      if (item.id == markerId) {
        item.width = 40;
        item.height = 47;
        itemData = item;
      } else {
        item.width = 30;
        item.height = 35;
      }
    })
    this.setData({
      markers,
      itemData,
      IsMarkerinfoShow: true
    })
  },
  // 关闭底部弹窗
  close_map_marker_box() {
    let markers = this.data.markers;
    markers.forEach(item => {
      item.width = 30;
      item.height = 35;
    })
    this.setData({
      markers: markers,
      IsMarkerinfoShow: false
    })
  },
  // 选择描点类型
  marker_type_seleced(e) {
    let code = e.currentTarget.dataset.code;
    let {
      markerTypeList,
      markerhideTypeList,
      roadMarkers,
      tollStationMarkers,
      serviceAreaMarkers
    } = this.data;
    markerTypeList.forEach(item => {
      if (item.code == code) {
        item.hide = !item.hide
      }
    })
    let index = markerhideTypeList.indexOf(code)
    if (index == -1) {
      markerhideTypeList.push(code)
    } else {
      markerhideTypeList.splice(index, 1)
    }
    this.setData({
      markerhideTypeList,
      markerTypeList,
      IsMarkerinfoShow: false
    })
    let markers = [];
    markerTypeList.forEach(item => {
      if (!item.hide) {
        if (item.code == 1) {
          markers = [...markers, ...roadMarkers]
        } else if (item.code == 3) {
          markers = [...markers, ...tollStationMarkers]
        }
        if (item.code == 4) {
          markers = [...markers, ...serviceAreaMarkers]
        }
      }
    })
    this.setData({
      markers
    })
  },
  // 获取所有描点信息
  getMarker() {
    let _this = this;
    let myLocation = wx.getStorageSync('myLocation'); //获取地址
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let paramCommon = {
      pageNum: 1,
      pageSize: 9999,
      distanse:100,
    }
    let param1 = {
      type: ''
    }
    let param2 = {
      jd: myLocation.longitude,
      wd: myLocation.latitude
    }
    let promisList = [];
    promisList.push(requst_get_queryRoadInfoDetail({
      ...paramCommon,
      ...param1
    }))
    promisList.push(requst_get_queryAllByDistance({
      ...paramCommon,
      ...param2
    }))
    promisList.push(requst_get_queryAllServiceAreaByDistanse({
      ...paramCommon,
      ...param2
    }))
    Promise.all(promisList).then(res => {
      _this.disposeMarker(res)
    }).catch(res => {
      wx.hideLoading()
      wx.showToast({
        title: '接口报错',
        icon: 'none',
        duration: 2000
      })
    })
  },
  //处理返回的数据
  disposeMarker(res) {
    let roadMarkers = []; //路况信息列表
    let tollStationMarkers = []; //收费站信息列表
    let serviceAreaMarkers = []; //服务区信息列表
    let flag = true; //接口返回值的是否有问题
    res.forEach(item => {
      let {
        data,
        code
      } = item.data;
      if (code =='1001') {
        let {
          records,
          total
        } = data;
        //  如果总数大于0
        if (total > 0) {
          //eventDetail,及为路况信息
          if (records[0].eventDetail) {
            records.forEach(item => {
              if (item.fstrGdX) {
                //随机数首位为1的就是路况信息
                item.id = parseInt('1' + this.createrandom()); //随机数
                switch (item.type) {
                  case '施工养护':
                    item.iconPath = '../../img/construction.png';
                    break;
                  case '恶劣天气':
                    item.iconPath = '../../img/Bad_weather.png';
                    break;
                  case '特情信息':
                    item.iconPath = '../../img/secret_info.png';
                    break;
                  default:
                    item.iconPath = '../../img/accident_icon.png';
                }
                item.latitude = item.fstrGdY;
                item.longitude = item.fstrGdX;
                item.dataType = 'accident';
                item.width = 30;
                item.height = 35;
                roadMarkers.push(item)
              }
            })
          } else if (records[0].stationId) {
            //收费站
            records.forEach(item => {
              if (item.gdLatitude) {
                //随机数首位为2的就是收费站
                item.id = parseInt('2' + this.createrandom()); //随机数
                item.iconPath = '../../img/tollstation_icon.png';
                item.latitude = item.gdLatitude;
                item.longitude = item.gdLongitude;
                item.dataType = 'tollstation';
                item.joinCluster = true;
                // item.clusterId = 2;
                item.width = 30;
                item.height = 35;
                tollStationMarkers.push(item)
              }
            })
          } else if (records[0].serviceAreaId) {
            //服务区
            records.forEach(item => {
              if (item.gdLatitude) {
                //随机数首位为3的就是服务区
                item.id = parseInt('3' + this.createrandom()); //随机数
                item.iconPath = '../../img/servicearea_icon.png';
                item.latitude = item.gdLatitude;
                item.longitude = item.gdLongitude;
                item.dataType = 'servicearea';
                item.joinCluster = true;
                // item.clusterId = 3;
                item.width = 30;
                item.height = 35;
                serviceAreaMarkers.push(item)
              }
            })
          }
        }
      } else {
        flag = false;
      }
    })
    wx.hideLoading()
    if (!flag) {
      wx.showToast({
        title: '接口报错',
        icon: 'none',
        duration: 2000
      })
    }
    let markers = [...roadMarkers, ...tollStationMarkers, ...serviceAreaMarkers]
    this.setData({
      roadMarkers,
      tollStationMarkers,
      serviceAreaMarkers,
      markers
    })
  },
  //生成随机数
  createrandom() {
    let num1 = parseInt((new Date().getTime() + '').slice(-8, -1));
    let num2 = parseInt(Math.random() * 1000000 + 1, 10);
    return num1 + num2;
  },
  // 获取所有高速
  async getgsData() {
    let param = {
      pageNum: 1,
      pageSize: 9999,
      searchText: ''
    }
    let {
      data
    } = await requst_get_queryAllRoadInfo(param)
    if (data.code == '1001') {
      let mapData = data.data.records.map(item => {
        let obj = item;
        obj.name_type = item.roadId.slice(0, 1);
        obj.count = item.roadEventTipsList.reduce((sum, item) => sum + item.count, 0);
        if (item.roadId.length > 3) {
          obj.startroad = item.roadId.slice(0, 3);
          obj.endroad = item.roadId.slice(3);
        }
        return obj;
      })
      this.setData({
        GsList: mapData,
      })
    }
  },
  //选择高速
  GSchoose(e) {
    let index = e.detail.value;
    let {
      GsList
    } = this.data;
    wx.setStorageSync('GsRoadInfo', GsList[index])
    wx.navigateTo({
      url: '/pages/high_speed_info/high_speed_info',
    })
  },
  //点击主体
  entranceClick(e) {
    let myLocation=wx.getStorageSync('myLocation')
    if (!myLocation) {
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //创建 map 上下文 MapContext 对象。
    this.MapContext = wx.createMapContext('myMap');
    this.MapContext.on('markerClusterCreate', res => {

    })
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