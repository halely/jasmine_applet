// pages/personal/personal.js
import {
  requst_get_login
} from '../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  //获取用户信息
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    let _this = this;
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo);
        _this.setData({
          userInfo: res.userInfo
        })
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 1000,
          mask: true
        })
        wx.nextTick(() => {
          _this.navigateHome()
        })
      },
      fail() {}
    })
  },
  //点击主体
  entranceClick(e) {
    let myLocation = wx.getStorageSync('myLocation')
    if (!myLocation) {
      wx.showToast({
        title: '请授权获取当前位置',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: '/pages/' + path + '/' + path,
    })
  },
  //登录获取token
  navigateHome() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code;
        requst_get_login({
          js_code: code
        }).then(({
          data
        }) => {
          //获取token
          if (data.code != 200) return false;
          wx.setStorageSync('access-token', data.token);
        }).catch(err => {
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 1500,
            mask: true
          })
        })
      }
    })

  },
  //进入收藏页面
  collectionView(e) {
    let userInfo = wx.getStorageSync('userInfo');
    let myLocation = wx.getStorageSync('myLocation')
    if (!userInfo) {
      wx.showToast({
        title: '该功能需要用户登录',
        icon: 'none',
        mask: true
      })
      return false;
    }
    if (!myLocation) {
      wx.showToast({
        title: '该功能需要用户授权地理位置',
        icon: 'none',
        mask: true
      })
      return false;
    }
    let code = e.currentTarget.dataset.code;
    if (!code) return false;
    wx.navigateTo({
      url: '/pages/collection/collection?code=' + code,
    })
  },

  // 联系客服
  PhoneCall() {
    wx.showModal({
      title: '您确认拨打96777服务热线吗？',
      content: '025-96777',
      confirmColor: '#12A86D',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '025-96777' //真实的电话号码
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //关于我们
  aboutView() {
    wx.navigateTo({
      url: '/pages/AboutUs/AboutUs',
    })
  },
  //退出登录
  loginout() {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '是否退出当前用户',
      success(res) {
        if (res.confirm) {
          let myLocation = wx.getStorageSync('myLocation')
          wx.clearStorageSync();
          wx.setStorageSync('myLocation', myLocation)
          _this.setData({
            userInfo: null
          })
          wx.showToast({
            title: '已退出当前用户',
            icon: 'none'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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
    let userInfo = wx.getStorageSync('userInfo');
    //判断是否在userInfo
    this.setData({
      userInfo: userInfo || ''
    })
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