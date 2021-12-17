// pages/path_plan_map/path_plan_map.js
var amapFile = require('../..//libs/amap-wx.130.js');
var config = require('../../libs/markers.js');
import {
  requst_post_lineSearchLineServiceArea,
  requst_post_lineSearchLineStation,
  requst_get_lineSearchHistroyinsert,
  requst_post_myCollectionifSave,
  requst_post_myCollectionDelete, //删除收藏
  requst_post_myCollectionlineInsert, //路线添加收藏
  requst_post_myCollectionstationInsert, //我的收藏-收费站-增加
  requst_post_myCollectionserviceAreaInsert //我的收藏-服务区-增加
} from '../../api/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myLocation: {},//当前位置
    markers: [],//描点信息
    polyline: {},//路径规划
    origin: {}, //起点
    destination: {}, //目的地
    pathInfoShow: false,
    current: 1,//路线切换
    popupShow: false,
    collectionId: '', //当前路由收藏id
    wayObj: {}, //方案集合
    serviceAreaList: [],//服务区数据
    stationIdList: [],//收费站数据
    stationIdListShow: true,
    serviceAreaShow: true,
    Typecurrent: 1,
    emptyShow: true
  },
  //选择起点
  getFormAddress() {
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
          origin
        })
        wx.nextTick(() => {
          that.getSure()
        })
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
  boxTouchmove(){
    return false;
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
          addressName: name,
          latitude: latitude,
          longitude: longitude,
          iconPath: '/img/destination.png',
          width: 35,
          height: 40
        }
        that.setData({
          destination
        })
        wx.nextTick(() => {
          that.getSure()
        })

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
    if (!(this.data.origin.longitude && this.data.destination.longitude)) return false;
    let {
      getpatway
    } = that;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      let {
        origin,
        destination
      } = this.data;
      this.lineSearchHistroyinsert(origin, destination);
      this.myCollectionifSave(origin, destination)
    }
    Promise.all([getpatway(34), getpatway(38), getpatway(33)]).then(res => {
      let {
        wayObj
      } = this.data;
      //第一次获取设置路线为高速优先
      this.lineSearchLineInfo(wayObj.gs)
    }).catch(res => {
      console.log('失败')
    })
  },
  //收藏点击
  focusonClick(e) {
    let accessToken = wx.getStorageSync('access-token');
    if (!accessToken) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }
    let {
      index,
      type
    } = e.currentTarget.dataset;
    let {
      serviceAreaList,
      stationIdList
    } = this.data;
    if (type == "service") {
      let collectionId = serviceAreaList[index].collectionId;
      if (collectionId) {
        this.get_myCollectionDelete([collectionId]).then(res => {
          if (res.code == '1001') {
            serviceAreaList[index].collectionId = ''
            this.setData({
              serviceAreaList
            })
          } else {
            wx.showToast({
              title: '取消收藏失败',
              icon: "none"
            })
          }
        })
      } else {
        this.pathAddCollection(type, serviceAreaList[index].serviceAreaId, index)
      }
    } else {
      let collectionId = stationIdList[index].collectionId;
      if (collectionId) {
        this.get_myCollectionDelete([collectionId]).then(res => {
          if (res.code == '1001') {
            stationIdList[index].collectionId = ''
            this.setData({
              stationIdList
            })
          } else {
            wx.showToast({
              title: '取消收藏失败',
              icon: "none"
            })
          }
        })
      } else {
        this.pathAddCollection(type, stationIdList[index].stationId, index)
      }
    }
  },
  //获取路线信息
  getpatway(type) {
    var that = this;
    var origin = that.data.origin.longitude + ',' + that.data.origin.latitude; //起点坐标
    var destination = that.data.destination.longitude + ',' + that.data.destination.latitude; //目的地坐标
    var webkey = config.markersData.webkey;
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://restapi.amap.com/v5/direction/driving',
        method: 'get',
        data: {
          key: webkey,
          origin, //起点经纬度
          destination, //目的地
          strategy: type,
          show_fields: 'polyline,cost,navi',
          AlternativeRoute: 0
        },
        success: (res => {
          if (res.statusCode === 200) {
            let {
              route: data
            } = res.data;
            var points = [];
            let markers = [];
            let sfzarr = []; //收费站
            markers.push(that.data.origin)
            markers.push(that.data.destination);
            if (data.paths && data.paths[0] && data.paths[0].steps) {
              var steps = data.paths[0].steps;
              for (var i = 0; i < steps.length; i++) {
                let assistant_action = steps[i].navi.assistant_action;
                var poLen = steps[i].polyline.split(';');
                if (assistant_action == '到达收费站') {
                  let path = poLen[poLen.length - 1];
                  sfzarr.push({
                    longitude: parseFloat(path.split(',')[0]),
                    latitude: parseFloat(path.split(',')[1]),
                  });
                }
                for (var j = 0; j < poLen.length; j++) {
                  points.push({
                    longitude: parseFloat(poLen[j].split(',')[0]),
                    latitude: parseFloat(poLen[j].split(',')[1])
                  })
                }
              }
            }
            let wayObj = this.data.wayObj;
            let temObj = {
              markers: markers,
              points: points,
              distance: data.paths[0].distance,
              cost: data.paths[0].cost,
              sfzarr: sfzarr
            }
            //高速优先
            switch (type) {
              case 34:
                wayObj.gs = temObj
                break;
              case 38:
                wayObj.time = temObj
                break;
              default:
                wayObj.lj = temObj
            }
            that.setData({
              wayObj
            })
            resolve(res);

          } else {
            reject()
          }
        })
      })
    })
  },
  //路线方式切换
  wayItemClick(e) {
    let code = e.currentTarget.dataset.code;
    let {
      current,
      wayObj
    } = this.data;
    if (code && code != current) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      if (code == 1) {
        this.lineSearchLineInfo(wayObj.gs)
      } else if (code == 2) {
        this.lineSearchLineInfo(wayObj.time)
      } else {
        this.lineSearchLineInfo(wayObj.lj)

      }
      this.setData({
        current: code
      })
      wx.nextTick(() => {
        wx.hideLoading()
      })
    }
  },
  //路线历史增加
  async lineSearchHistroyinsert(origin, destination) {
    let param = {
      startGdLongitude: origin.longitude,
      startGdLatitude: origin.latitude,
      startPlaceName: origin.addressName,
      endGdLatitude: destination.latitude,
      endGdLongitude: destination.longitude,
      endPlaceName: destination.addressName,
    }
    let {
      data
    } = await requst_get_lineSearchHistroyinsert(param);
    if (data.code != '1001') {
      wx.showToast({
        title: '存入记录报错',
        icon: "none"
      })
    }

  },
  //判断路线是否收藏
  async myCollectionifSave(origin, destination) {
    let param = {
      startGdLongitude: origin.longitude,
      startGdLatitude: origin.latitude,
      startPlaceName: origin.addressName,
      endGdLatitude: destination.latitude,
      endGdLongitude: destination.longitude,
      endPlaceName: destination.addressName,
    }
    let {
      data
    } = await requst_post_myCollectionifSave(param);
    if (data.code == '1001') {
      if (data.data) {
        this.setData({
          collectionId: data.data.collectionId
        })
      } else {
        this.setData({
          collectionId: ''
        })
      }
    }
  },
  //收藏点击
  pathcollection() {
    let accessToken = wx.getStorageSync('access-token');
    if (!accessToken) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }
    let {
      collectionId,
      origin,
      destination
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
      this.lineAddCollection(origin, destination)
    }
  },
  //路线添加收藏
  async lineAddCollection(origin, destination) {
    let param = {
      startGdLongitude: origin.longitude,
      startGdLatitude: origin.latitude,
      startPlaceName: origin.addressName,
      endGdLatitude: destination.latitude,
      endGdLongitude: destination.longitude,
      endPlaceName: destination.addressName,
    }
    let {
      data
    } = await requst_post_myCollectionlineInsert(param);
    if (data.code == '1001' && data.data.collectionId) {
      this.setData({
        collectionId: data.data.collectionId
      })
    }
  },
  //收费站服务区添加收藏
  async pathAddCollection(type, id, index) {
    //服务区
    let {
      serviceAreaList,
      stationIdList
    } = this.data;
    if (type == 'service') {
      let {
        data
      } = await requst_post_myCollectionserviceAreaInsert({
        serviceAreaId: id
      });
      if (data.code == '1001' && data.data.collectionId) {
        serviceAreaList[index].collectionId = data.data.collectionId;
        this.setData({
          serviceAreaList
        })
      }
    } else {
      //收费站
      let {
        data
      } = await requst_post_myCollectionstationInsert({
        stationId: id
      });
      if (data.code == '1001' && data.data.collectionId) {
        stationIdList[index].collectionId = data.data.collectionId;
        this.setData({
          stationIdList
        })
      }
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
  //触摸开始事件
  touchStart(e) {
    let touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    let touchDotY = e.touches[0].pageY;
    this.touchStartY = touchDotY;
  },
  //触摸结束事件
  touchEnd(e) {
    let touchDotX = e.changedTouches[0].pageX; // 获取触摸时的原点
    let touchDotY = e.changedTouches[0].pageY;
    let num = Math.abs(parseInt(touchDotY) - parseInt(this.touchStartY))
    if (touchDotY > this.touchStartY) {
      if (num < 50) return false;
      this.setData({
        pathInfoShow: false
      })
    } else {
      if (num < 50) return false;
      this.setData({
        pathInfoShow: true
      })
    }
  },
  // 查询服务区和收费站信息
  lineSearchLineInfo(waydata) {
    let {
      myLocation
    } = this.data;
    let param1 = {
      jd: myLocation.longitude,
      wd: myLocation.latitude,
      list: waydata.points
    }
    let param2 = {
      jd: myLocation.longitude,
      wd: myLocation.latitude,
      list: waydata.sfzarr
    }
    Promise.all([requst_post_lineSearchLineServiceArea(param1), requst_post_lineSearchLineStation(param2)]).then(res => {
      let stationIdList = [];
      let serviceAreaList = []
      res.forEach(item => {
        let data = item.data.data;
        if (item.data.code == '1001') {
          if (data.length > 0) {
            if (data[0].stationId) {
              stationIdList = data;
            } else {
              serviceAreaList = data;
            }
          }
        }

      });
      let newmarkers = JSON.parse(JSON.stringify(waydata.markers));
      //收费站
      stationIdList = stationIdList.map(item => {
        let obj = {
          name: item.stationName + '收费站',
          longitude: item.gdLongitude,
          latitude: item.gdLatitude,
          width: 25,
          height: 30,
          iconPath: '/img/tollstation_icon.png'
        }
        item = {
          ...item,
          ...obj
        }
        return item
      })
      serviceAreaList = serviceAreaList.map(item => {
        let obj = {
          name: item.serviceAreaName,
          longitude: item.gdLongitude,
          latitude: item.gdLatitude,
          width: 25,
          height: 30,
          iconPath: '/img/servicearea_icon.png'
        }
        item = {
          ...item,
          ...obj
        };
        return item;
      })
      newmarkers = [...newmarkers, ...serviceAreaList, ...stationIdList];
      let totalarr = [...serviceAreaList, ...stationIdList]
      this.setData({
        markers: newmarkers,
        serviceAreaList,
        stationIdList,
        polyline: [{
          points: waydata.points,
          arrowLine: true,
          color: "#07C160",
          width: 8
        }],
        popupShow: true,
        emptyShow: !totalarr.length
      });
      wx.nextTick(() => {
        wx.hideLoading()
      })
    })
  },
  //底部类型切换
  TypeSelected(e) {
    let code = e.target.dataset.code;
    let {
      Typecurrent,
      serviceAreaList,
      stationIdList
    } = this.data;
    let totalarr = [...serviceAreaList, ...stationIdList]
    if (code && code != Typecurrent) {
      if (code == 1) {
        this.setData({
          stationIdListShow: true,
          serviceAreaShow: true,
          Typecurrent: code,
          emptyShow: !totalarr.length
        })
      } else if (code == 2) {
        this.setData({
          stationIdListShow: true,
          serviceAreaShow: false,
          Typecurrent: code,
          emptyShow: !stationIdList.length
        })
      } else {
        this.setData({
          stationIdListShow: false,
          serviceAreaShow: true,
          Typecurrent: code,
          emptyShow: !serviceAreaList.length
        })
      }

    }
  },
  //服务区列表点击
  serviceAreaItemClick(e) {
    //设置缓存
    wx.setStorageSync('serviceAreaItemInfo', e.currentTarget.dataset.info);
    wx.navigateTo({
      url: '/pages/serviceAreaInfo/serviceAreaInfo',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let myLocation = wx.getStorageSync('myLocation');
    this.setData({
      myLocation: myLocation,
    })
    let pathObj = wx.getStorageSync('pathObj');
    this.setData({
      origin: pathObj.origin,
      destination: pathObj.destination
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getSure()
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