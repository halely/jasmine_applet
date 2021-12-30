// pages/login/login.js

import {
  requst_get_login
} from '../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    let _this = this;
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.userInfo = res.userInfo;
        wx.nextTick(() => {
          _this.navigateHome()
        })
      },
      fail() {}
    })
  },
  //登录获取token
  navigateHome() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code;
        wx.showLoading({
          title: '登录中...',
          mask: true
        })
        requst_get_login({
          js_code: code
        }).then(({
          data
        }) => {
          wx.hideLoading()
          //获取token
          if (data.code != 200) return false;
          wx.showToast({
            title: '授权成功',
            icon: 'success',
            duration: 1000,
            mask: true
          })
          wx.setStorageSync('userInfo', this.userInfo);
          wx.setStorageSync('access-token', data.token);
          //返回上一个页面
          wx.navigateBack({
            delta: 1
          })
        }).catch(err => {
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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