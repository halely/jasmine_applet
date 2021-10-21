// pages/collection/collection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:1,
    array: ['全部时间', '最近一个月', '最近三个月', '最近六个月'],
    arrayindex: 0,
    managementStats: false, //是否点击了管理
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
      },
      {
        id: '4',
        name: '康缘智汇港 - 南京南站',
        time: '2021.10.08'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //类型切换
  tabClick(e) {
    let code=e.target.dataset.code;
    let current=this.data.current;
    if(code && code!=current){
      this.setData({
        current:code,
        arrayindex:0,
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