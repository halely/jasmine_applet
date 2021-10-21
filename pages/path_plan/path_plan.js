// pages/path_plan/path_plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '2',
    array: ['全部时间', '最近一个月', '最近三个月', '最近六个月'],
    arrayindex: 0,
    managementStats: true, //是否点击了管理
    collectList: [{
        id: '1',
        name: '南京南站 - 康缘智汇港',
        time: '2021.10.08'
      }, {
        id: '2',
        name: '江苏省高速公路联网营运管理中心 - 康缘智汇港',
        time: '2021.10.08'
      },
      {
        id: '3',
        name: '康缘智汇港 - 南京南站',
        time: '2021.10.08'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.navigateHome()
  },
  //记录和收藏的切换
  tabSelected(e) {
    let code = e.target.dataset.id;
    let current = this.data.current;
    if (code && current != code) {
      this.setData({
        current: code,
        managementStats:false
      })
    }
  },
  //时间选择
  bindPickerChange: function (e) {
    this.setData({
      arrayindex: e.detail.value
    })
  },
  //管理变更
  managementClick() {
    let state = this.data.managementStats;
    this.setData({
      managementStats: !state
    })
  },
  // 收藏项选择
  collectionClick(e) {
    let code = e.currentTarget.dataset.code;
    console.log(code)
  },
  navigateHome() {
    //登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code;
        console.log(code)
      }
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