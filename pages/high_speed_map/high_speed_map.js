// pages/high_speed_map/high_speed_map.js
import {
  requst_get_queryRoadInfoDetail,
  requst_get_queryAllByDistance,
  requst_get_queryAllServiceAreaByDistanse,
  requst_post_myCollectionDelete,
  requst_post_myCollectionRoadInsert,
  requst_get_roadifSave
} from '../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focusonState: false,
    center: [],
    scale: 10,
    roadMarkers: [], //路况信息列表
    tollStationMarkers: [], //收费站信息列表
    serviceAreaMarkers: [], //服务区信息列表
    markerTypeList: [{
      code: 1,
      icon: '/img/road.png',
      name: '路况',
      hide: false,
    }, {
      code: 2,
      icon: '/img/corssbridge.png',
      name: '过江大桥',
      hide: false,
    }, {
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
    markers: [],
    IsMarkerinfoShow: false, //底部弹窗是否显示
    GsRoadInfo: {},
    myLocation: [],
    collectionId: '',
    loginStatus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStorage();
    this.getMarker();
    this.getroadifSave()

  },
  //获取缓存信息
  getStorage() {
    let GsRoadInfo = wx.getStorageSync('GsRoadInfo');
    let myLocation = wx.getStorageSync('myLocation')
    if (GsRoadInfo && myLocation) {
      let center = [];
      center[0] = myLocation.longitude;
      center[1] = myLocation.latitude;
      this.setData({
        GsRoadInfo,
        center,
        myLocation
      })
    }
  },
  //收藏点击
  focusonClick() {
    let token = wx.getStorageSync('access-token');
    if (!token) return;
    let {
      focusonState
    } = this.data;
    if (focusonState) {
      //取消收藏
      this.get_myCollectionDelete()
    } else {
      this.get_myCollectionRoadInsert()
    }

  },
  //删除收藏
  async get_myCollectionDelete() {
    let list = [];
    list.push(this.data.collectionId)
    let {
      data
    } = await requst_post_myCollectionDelete({
      list
    })
    if (data.code != '1001') {
      console.log('取消失败')
    } else {
      this.setData({
        focusonState: !this.data.focusonState
      })
    }
  },
  //添加收藏
  async get_myCollectionRoadInsert() {
    let {
      data: res
    } = await requst_post_myCollectionRoadInsert({
      roadId: this.data.GsRoadInfo.roadId
    })
    let {
      data,
      code
    } = res;
    if (code == '1001' && data) {
      this.setData({
        focusonState: !this.data.focusonState,
        collectionId: data.collectionId
      })
    }

  },
  //查询是否已经收藏
  async getroadifSave() {
    let token = wx.getStorageSync('access-token');
    if (!token) return;
    let GsRoadInfo = wx.getStorageSync('GsRoadInfo');
    let {
      data: res
    } = await requst_get_roadifSave({
      roadId: GsRoadInfo.roadId
    })
    if (res.code == 1001) {
      if (res.data) {
        this.setData({
          collectionId: res.data.collectionId,
          focusonState: true
        })
      } else {
        this.setData({
          collectionId: '',
          focusonState: false
        })
      }
    }
    //如果没有收藏，返回的为null

  },
  //描点点击
  bindmarkertap(e) {
    let markerId = e.markerId;
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
    if (Object.keys(itemData).length === 0) return false;
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
    let center = [];
    if (markers.length) {
      center.push(markers[0].longitude);
      center.push(markers[0].latitude);
    } else {
      center.push(this.data.myLocation.longitude);
      center.push(this.data.myLocation.latitude);
    }
    this.setData({
      markers,
      center
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
      roadId: _this.data.GsRoadInfo.roadId
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
      // console.log(res)
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
      if (code == 1001) {
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
                // item.clusterId = 1;
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
    if (!flag) {
      wx.hideLoading()
      wx.showToast({
        title: '接口报错',
        icon: 'none',
        duration: 2000
      })
    }
    let markers = [...roadMarkers, ...tollStationMarkers, ...serviceAreaMarkers];
    let center = []
    if (markers.length) {
      center.push(markers[0].longitude);
      center.push(markers[0].latitude);
    } else {
      center.push(this.data.myLocation.longitude);
      center.push(this.data.myLocation.latitude);
    }
    this.setData({
      roadMarkers,
      tollStationMarkers,
      serviceAreaMarkers,
      markers,
      center
    })
    wx.nextTick(()=>{
      wx.hideLoading()
    })
  },
  //生成随机数
  createrandom() {
    let num1 = parseInt((new Date().getTime() + '').slice(-8, -1));
    let num2 = parseInt(Math.random() * 1000000 + 1, 10);
    return num1 + num2;
  },
  islogin() {
    let accessToken = wx.getStorageSync('access-token')
    this.setData({
      loginStatus: accessToken ? true : false
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
    this.islogin()
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