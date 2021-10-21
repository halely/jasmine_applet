// pages/high_speed_map/high_speed_map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focusonState: false,
    center: ['118.917935', '32.06946'],
    scale: 10,
    markers: [{
        id: 123456,
        latitude: '32.06946',
        longitude: '118.917935',
        width: 30,
        height: 35,
        iconPath: '../../img/accident_icon.png'
      },
      {
        id: 234584,
        latitude: '32.346829',
        longitude: '118.915131',
        width: 30,
        height: 35,
        iconPath: '../../img/accident_icon.png'
      }
    ],
    IsMarkerinfoShow: false, //底部弹窗是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //关注点击
  focusonClick() {
    this.setData({
      focusonState: !this.data.focusonState
    })
  },
  //描点点击
  bindmarkertap(e) {
    let markerId = e.markerId
    console.log(markerId)
    let markers = this.data.markers;
    markers.forEach(item => {
      if (item.id == markerId) {
        item.width = 40;
        item.height = 47;
      } else {
        item.width = 30;
        item.height = 35;
      }
    })
    this.setData({
      markers: markers,
      IsMarkerinfoShow:true
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
      IsMarkerinfoShow:false
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