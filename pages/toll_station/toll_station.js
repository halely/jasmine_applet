// pages/toll_station/toll_station.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    toll_station_list: [{
        id: 1,
        open: false
      },
      {
        id: 2,
        open: false
      },
      {
        id: 3,
        open: false
      },
      {
        id: 4,
        open: false
      }
    ],
    cityList:[{
      name:'南京',
      num:4
    },{
      name:'无锡',
      num:2
    },{
      name:'徐州',
      num:0
    },{
      name:'常州',
      num:2
    },{
      name:'盐城',
      num:0
    }],
    selectCity:'南京'
  },
  tabChange(e) {
    let current = e.target.dataset.current;
    if (current != undefined) {
      this.setData({
        current: current
      })
    }
  },
  bindconfirm(e) {
    wx.showToast({
      title: e.detail.value,
      icon: 'success',
      duration: 2000
    })
  },
  // 点击关闭原因
  openButClick(e) {
    let index = e.currentTarget.dataset.index;
    let toll_station_list = this.data.toll_station_list;
    toll_station_list[index].open = !toll_station_list[index].open;
    this.setData({
      toll_station_list: toll_station_list
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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