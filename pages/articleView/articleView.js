// pages/articleView/articleView.js
import {
  Base64
} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    html: '',
    articleData:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type;
    this.setData({
      type
    })
    this.setHtml()

  },
  setHtml() {
    let articleData = wx.getStorageSync('articleData');
    var base = new Base64();//保证引入路径真确
    var htmlTpl = base.decode(articleData.policyContent);  
    this.setData({
      html:htmlTpl,
      articleData:articleData
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