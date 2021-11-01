// pages/path_plan/path_plan.js

import {
  requst_get_lineSearchHistroyqueryMine,
  requst_get_myCollectionLine,
  requst_get_lineSearchHistroydelete,
  requst_post_myCollectionDelete
  
} from '../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '1',
    array: [{
      code: '',
      text: "全部时间"
    }, {
      code: '1',
      text: "最近一个月"
    }, {
      code: '3',
      text: "最近三个月"
    }, {
      code: '6',
      text: "最近六个月"
    }],
    origin: {}, //起点
    destination: {}, //目的地
    arrayindex: 0,
    lineHistroy: [], //路线历史
    myLocation: {}, //当前位置
    managementStats: false, //是否点击了管理
    collectList: [],
    searchType: '',
    selecteArr: [], //选中的索引值数组
    allselecte: false, //全选
  },
  //选择起点
  getFormAddress: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        let {
          address,
          latitude,
          longitude,
          name
        } = res;
        if (!address) return false;
        let origin = {
          name: name,
          latitude: latitude,
          longitude: longitude,
          addressName: name,
          iconPath: '/img/origin.png',
          width: 35,
          height: 40
        }
        that.setData({
          origin: origin,
        })
        that.getSure()
      },
      fail: function () {
        wx.showToast({
          title: '定位失败',
          icon: "none"
        })
      },
      complete: function () {
        //隐藏定位中信息进度
        wx.hideLoading()
      }
    })
  },
  //选择目的地
  getToAddress: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        let {
          address,
          latitude,
          longitude,
          name
        } = res;
        console.log(res)
        if (!address) return false;
        let destination = {
          name: name,
          latitude: latitude,
          addressName: name,
          longitude: longitude,
          iconPath: '/img/destination.png',
          width: 35,
          height: 40
        }
        that.setData({
          destination: destination,
        })
        that.getSure()
      },
      fail: function () {
        wx.showToast({
          title: '定位失败',
          icon: "none"
        })
      },
      complete: function () {
        //隐藏定位中信息进度
        wx.hideLoading()
      }
    })
  },
  // 切换地址
  switchPath() {
    let {
      origin,
      destination
    } = this.data;
    let temporary = JSON.parse(JSON.stringify(origin));
    origin = JSON.parse(JSON.stringify(destination));
    origin.iconPath = '/img/origin.png';
    destination = temporary;
    temporary.iconPath = '/img/destination.png';
    this.setData({
      origin: origin,
      destination: destination
    })
    this.getSure()
  },
  /**
   * 确定
   */
  getSure: function () {
    var that = this;
    // 判断地址有没有都输入
    if (!(this.data.origin.longitude && this.data.destination.longitude)) return false;
    let pathObj = {
      origin: this.data.origin,
      destination: this.data.destination
    }
    wx.setStorageSync('pathObj', pathObj)
    wx.navigateTo({
      url: '/pages/path_plan_map/path_plan_map',
    })
  },
  //查询历史记录
  async get_lineSearchHistroyqueryMine() {
    let {
      data: res
    } = await requst_get_lineSearchHistroyqueryMine();
    if (res.code == '1001') {
      this.setData({
        lineHistroy: res.data
      })
    }
  },
  //清除历史记录
  get_lineSearchHistroydelete() {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '是否清除历史记录',
      success(res) {
        if (res.confirm) {
          requst_get_lineSearchHistroydelete().then(res => {
            if (res.data.code == '1001') {
              wx.showToast({
                title: '清除记录成功',
                icon: "none"
              })
              _this.setData({
                lineHistroy: []
              })
            }
          })
        }
      }
    })

  },
  //跳转页面
  lineHistroyClick(e) {
    let code = e.currentTarget.dataset.code;
    let {
      lineHistroy
    } = this.data;
    this.jumpPath(lineHistroy[code])
  },
  jumpPath(item) {
    let origin = {
      name: item.startPlaceName,
      latitude: item.startGdLatitude,
      longitude: item.startGdLongitude,
      addressName: item.startPlaceName,
      iconPath: '/img/origin.png',
      width: 35,
      height: 40
    }
    let destination = {
      name: item.endPlaceName,
      latitude: item.endGdLatitude,
      addressName: item.endPlaceName,
      longitude: item.endGdLongitude,
      iconPath: '/img/destination.png',
      width: 35,
      height: 40
    }
    let pathObj = {
      origin,
      destination
    }
    wx.setStorageSync('pathObj', pathObj)
    wx.navigateTo({
      url: '/pages/path_plan_map/path_plan_map',
    })
  },
  //我的收藏-路线
  async get_myCollectionLine() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let wxData = this.data;
    let param = {
      pageNum: 1,
      pageSize: 9999,
      searchType: wxData.searchType
    }
    let {
      data
    } = await requst_get_myCollectionLine(param)
    wx.hideLoading()
    if (data.code == '1001') {
      this.setData({
        collectList: data.data.records
      })
    } else {
      wx.showToast({
        title: '数据获取失败',
        icon: 'none',
        duration: 1500,
        mask: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let myLocation = wx.getStorageSync('myLocation');
    let origin = {
      name: '当前位置',
      latitude: myLocation.latitude,
      longitude: myLocation.longitude,
      addressName: myLocation.township,
      iconPath: '/img/origin.png',
      width: 35,
      height: 40
    }
    this.setData({
      myLocation: myLocation,
      origin: origin
    })
  },
  //记录和收藏的切换
  tabSelected(e) {
    let code = e.target.dataset.id;
    let current = this.data.current;
    if (code && current != code) {
      this.setData({
        current: code,
        managementStats: false,
        selecteArr: [], //选中的索引值数组
        allselecte: false, //全选
      })
    }
  },
  //收藏路线跳转
  collectItemView(e){
    let code = e.currentTarget.dataset.index;
    let {
      collectList,
      managementStats
    } = this.data;
    if(managementStats) return false;
    this.jumpPath(collectList[code])
  },
  //时间选择
  bindPickerChange: function (e) {
    let {
      array
    } = this.data;
    this.setData({
      collectList: [],
      searchType: array[e.detail.value].code,
      arrayindex: e.detail.value
    })
    this.get_myCollectionLine()
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
    if (!this.data.managementStats) return false;
    let {
      selecteArr,
      collectList
    } = this.data;
    let code = e.currentTarget.dataset.index;
    let index = selecteArr.indexOf(code);
    if (index == '-1') {
      selecteArr.push(code);
    } else {
      selecteArr.splice(index, 1)
    }
    let allselecte = false;
    if (collectList.length) {
      allselecte = collectList.length == selecteArr.length
    }
    this.setData({
      selecteArr,
      allselecte
    })
  },
  //全选点击
  allClick() {
    let {
      collectList,
      allselecte
    } = this.data;
    if (allselecte) {
      this.setData({
        selecteArr: [],
        allselecte: false
      })
    } else {
      let selecteArr = collectList.map((item, index) => {
        return index
      })
      this.setData({
        selecteArr,
        allselecte: true
      })
    }
  },
  //调用删除
  deleteAll() {
    let _this = this;
    let {
      collectList,
      selecteArr
    } = _this.data;
    if (!selecteArr.length) {
      wx.showToast({
        title: '请选择删除项',
        icon: 'none'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请确定是否删除',
        success(res) {
          if (res.confirm) {
            let list = [];
            selecteArr.forEach(item => {
              list.push(collectList[item].collectionId)
            })
            //开始删除
            _this.post_myCollectionDelete(list)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }
  },
  //删除方法
  async post_myCollectionDelete(list) {
    let {
      data
    } = await requst_post_myCollectionDelete({
      list
    })
    if (data.code == '1001') {
      wx.showToast({
        title: '删除成功',
        icon: 'none'
      })
      this.setData({
        managementStats: false, //是否点击了管理
        collectList: [],
        selecteArr: [], //选中的索引值数组
        allselecte: false, //全选
      })
      this.get_myCollectionLine()
    }
  },
  //选中恢复x
  selectedrestore() {
    this.setData({
      managementStats: false, //是否点击了管理
      selecteArr: [], //选中的索引值数组
      allselecte: false, //全选
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
    this.selectedrestore()
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.get_lineSearchHistroyqueryMine();
      this.get_myCollectionLine()
    }

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