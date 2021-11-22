// pages/emergencyRescue/emergencyRescue.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addreeInfoHide: false,
    flag: false, //是否点击下一步
    scale: 16, //缩放级别
    minScale: 3, //最小缩放级别
    maxScale: 20 //最大缩放级别
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.location()
  },
  //触摸开始事件
  touchStart(e) {
    let touchDotY = e.touches[0].pageY;
    this.touchStartY = touchDotY;
  },
  //触摸结束事件
  touchEnd(e) {
    let touchDotY = e.changedTouches[0].pageY;
    let num = Math.abs(parseInt(touchDotY) - parseInt(this.touchStartY))
    if (num < 50) return false;
    if (touchDotY > this.touchStartY) {
      // 下拉
      this.setData({
        addreeInfoHide: true
      })
    } else {
      // 上拉
      this.setData({
        addreeInfoHide: false
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
    //获取当前缩放程度
    this.MapContext.getScale({
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
  },
  // 实时获取当前位置
  // 这个函数 在 onLoad内触发 或 点击触发
  async location() {
    const that = this;
    try {
      await that.getWxLocation()
      this.MapContext.moveToLocation();
    } catch (error) {
      wx.showModal({
        title: '是否授权当前位置',
        content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
        success: function (res) {
          if (res.confirm) {
            that.toSetting()
          }
        }
      })
      return
    }
  },

  // 获取位置信息
  getWxLocation() {
    let _this = this;
    return new Promise((resolve, reject) => {
      const _locationChangeFn = (res) => {
        console.log('location change', res)
        if (_this.data.flag) {
          console.log(res)
        }
        _this.setData({
          flag: false
        })
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
          _this.setData({
            flag: false
          })
        }
      }
    })
  },
  nextStep() {
    this.setData({
      flag: true
    })
    this.location()
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