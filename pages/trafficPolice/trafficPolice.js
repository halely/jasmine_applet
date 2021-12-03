// pages/trafficPolice/trafficPolice.js
import {
  throttle
} from '../../utils/util'
import {
  requst_get_queryHandyTrafficPoliceBrigade
} from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale: 18,
    windowHeight: 0,
    top: 1000,
    mintop: 0,
    maxtop: 0,
    listData: [],
    center: [],
    myLocation: {},
    pageNum: 1, //页码
    pageSize: 10, //页数
    searchText: "", //模糊查询
    total: 0, //列表总数
    scale: 16, //缩放级别
    minScale: 3, //最小缩放级别
    maxScale: 20 //最大缩放级别
  },
  bindconfirm(e) {
    this.setData({
      searchText: e.detail.value,
      pageNum: 1,
      listData: [],
      total: 0
    })
    wx.nextTick(() => {
      this.getData()
    })
  },
  //获取列表
  async getData() {
    let wxData = this.data;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let param = {
      pageNum: wxData.pageNum,
      pageSize: wxData.pageSize,
      searchText: wxData.searchText,
      jd: wxData.myLocation.longitude,
      wd: wxData.myLocation.latitude
    }
    let {
      data
    } = await requst_get_queryHandyTrafficPoliceBrigade(param)
    wx.hideLoading()
    if (data.code == '1001') {
      let mapData = data.data.records.map(item => {
        let obj = {
          id: parseInt(item.brigadeId),
          latitude: item.gdLatitude,
          longitude: item.gdLongitude,
          title: item.address,
          width: 35,
          height: 40,
          customCallout: {
            anchorY: 0,
            anchorX: 0,
          },
          iconPath: '/img/policeIcon.png'
        }
        return {
          ...item,
          ...obj
        }
      })
      let newData = wxData.listData.concat(mapData)
      this.setData({
        listData: newData,
        total: data.data.total
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
      this.getData()
    }
  },
  //列表项点击效果
  ListClick(e) {
    let res = e.currentTarget.dataset;
    let center = [res.longitude, res.latitude];
    this.setData({
      center
    })
  },
  //列表去这里点击效果
  tarfficClick(e) {
    this.toMapApp(e.currentTarget.dataset.code)
  },
  toMapApp(id) {
    let listData = this.data.listData;
    let targetData = listData.find(item => {
      return item.id == id;
    })
    wx.openLocation({
      latitude: Number(targetData.latitude), // 纬度，范围为-90~90，负数表示南纬
      longitude: Number(targetData.longitude), // 经度，范围为-180~180，负数表示西经
      scale: 8, // 缩放比例
      name: targetData.brigadeName,
      address: targetData.address,
      success: function (r) {
        console.log(r)
      }
    })
  },
  // 点击自定义maptip
  bindcallouttap(e) {
    this.toMapApp(e.detail.markerId)
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
    //获取浏览器高度
    const sysInfo = wx.getSystemInfoSync();
    this.setData({
      windowHeight: sysInfo.windowHeight,
      top: sysInfo.windowHeight - 250,
      maxtop: sysInfo.windowHeight - 130,
      mintop: 220
    })
    this.getData()
  },
  //触摸开始
  touchstart(e) {
    let touchstartY = e.touches[0].pageY;
    this.pageY = touchstartY;
  },
  // 手指滑动
  touchmove: throttle((that, e) => {
    let touchmoveY = e.touches[0].pageY;
    let {
      top,
      mintop,
      maxtop
    } = that.data;
    //相差绝对值
    let num = Math.abs(parseInt(touchmoveY) - parseInt(that.pageY));

    if (num < 10) return false;
    // 下拉
    if (touchmoveY > that.pageY) {
      let newtop = top + num;
      if (num > 40) {
        newtop = top + 80;
      }
      newtop = newtop > maxtop ? maxtop : newtop;
      that.pageY = touchmoveY;
      that.setData({
        top: newtop
      })
    } else {
      //上划
      let newtop = top - num;
      if (num > 40) {
        newtop = top - 80;
      }
      newtop = newtop < mintop ? mintop : newtop;
      that.pageY = touchmoveY;
      that.setData({
        top: newtop
      })
    }
  }, 0),
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //设置map
    this.MapContext = wx.createMapContext('tarfficMap');
    wx.nextTick(() => {
      setTimeout(() => {
        this.MapContext.moveToLocation();
      }, 1000);
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