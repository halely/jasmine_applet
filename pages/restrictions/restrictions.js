// pages/restrictions/restrictions.js

import {
  requst_post_queryAllRoad
} from '../../api/index.js'
import {
  getevaluationVisit
} from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [], //列表数据
    pageNum: 1, //页码
    pageSize: 10, //页数
    total: 0, //列表总数
    searchText: '' //搜索条件
  },
  bindconfirm(e) {
    this.setData({
      searchText: e.detail.value,
      pageNum: 1,
      listData: [],
      total: 0
    })
    wx.nextTick(() => {
      this.getData()
    })
  },
  //列表查询
  async getData() {
    let wxData = this.data;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let param = {
      pageNum: wxData.pageNum,
      pageSize: wxData.pageSize,
      searchText: wxData.searchText
    }
    let {
      data
    } = await requst_post_queryAllRoad(param)
    wx.hideLoading()
    if (data.code == '1001') {
      let mapData = data.data.records.map(item => {
        let obj = item;
        obj.name_type = item.roadId.slice(0, 1);
        if (item.roadId.length > 3) {
          obj.startroad = item.roadId.slice(0, 3);
          obj.endroad = item.roadId.slice(3);
        }
        return obj;
      })
      let newData = wxData.listData.concat(mapData);
      this.setData({
        listData: newData,
        total: data.data.total,
      })
      this.setCollapse()
    }
  },
  //判断全文收起是否展示

  setCollapse: function () {
    var query = wx.createSelectorQuery();
    var that = this;
    query.selectAll('.restrictionText').boundingClientRect(function (rect) {
      rect.forEach((v, i) => {
        if (v.height > 40) {
          var set1 = "listData[" + i + "].collapse"; //存在超过
          var set2 = "listData[" + i + "].showCollapse"; //是否显示全文
          that.setData({
            [set1]: true,
            [set2]: that.data[set2] ? true : false,
          })
        }
      })
    }).exec();
  },
  unfoldclick(e) {
    let index = e.currentTarget.dataset.index;
    var set = "listData[" + index + "].showCollapse"; //是否显
    this.setData({
      [set]: !this.data.listData[index].showCollapse
    })
  },
  //监听滚动
  scrolltolower() {
    let wxData = this.data;
    if (wxData.listData.length < wxData.total) {
      let pageNum = wxData.pageNum += 1;
      this.setData({
        pageNum: pageNum
      })
      this.getData()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
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
    getevaluationVisit('车辆限行')
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
    wx.stopPullDownRefresh()
    this.setData({
      pageNum: 1,
      listData: [],
      total: 0
    })
    wx.nextTick(() => {
      this.getData()
    })
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