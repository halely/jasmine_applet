// pages/personal/personal.js
import {
  requst_get_userPhone,
  requst_get_UserInfo,
  requst_get_uploadUserInfo
} from '../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    uploadUserInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  //登录
  loginView() {
    wx.navigateTo({
      url: '/pages/login/login',
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
  //评价
  evaluation() {
    wx.navigateTo({
      url: '/pages/evaluation/evaluation',
    })
  },
  //关于我们
  aboutView() {
    wx.navigateTo({
      url: '/pages/AboutUs/AboutUs',
    })
  },
  //获取手机号
  getPhoneNumber: function (e) {
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      requst_get_userPhone({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }).then(({
        data
      }) => {
        if (data.code == '1001') {
          this.setData({
            uploadUserInfo: {
              nickName: that.data.userInfo.nickName,
              phonenumber: data.data,
            }
          })
          wx.nextTick(() => {
            this.get_uploadUserInfo()
          })
        }
      })
    }
  },
  //获取用户信息
  async getUserInfo() {
    let {
      data
    } = await requst_get_UserInfo()
    if (data.code == '1001') {
      this.setData({
        uploadUserInfo: {
          nickName: data.data.nickName,
          phonenumber: data.data.phonenumber
        }
      })
    }
  },
  //添加用户信息
  async get_uploadUserInfo() {
    let WxData = this.data;
    if (WxData.uploadUserInfo) {
      let {
        data
      } = await requst_get_uploadUserInfo({
        nickName: WxData.uploadUserInfo.nickName,
        phonenumber: WxData.uploadUserInfo.phonenumber
      })
    }
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
    if (userInfo) {
      this.getUserInfo();
    }
    this.setData({
      userInfo: userInfo ? userInfo : null
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