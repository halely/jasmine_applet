// pages/serviceArea/serviceArea.js
import {
  requst_get_queryAllServiceAreaByDistanse,
  requst_get_queryRoad
} from '../../api/index.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    conditionSelect: '',
    cityList: [{
      name: '南京',
      key: '320100'
    }, {
      name: '无锡',
      key: '320200'
    }, {
      name: '徐州',
      key: '320300  '
    }, {
      name: '常州',
      key: '320400'
    }, {
      name: '苏州',
      key: '320500'
    }, {
      name: '南通',
      key: '320600'
    }, {
      name: '连云港',
      key: '320700'
    }, {
      name: '淮安',
      key: '320800'
    }, {
      name: '盐城',
      key: '320900'
    }, {
      name: '扬州',
      key: '321000'
    }, {
      name: '镇江',
      key: '321100'
    }, {
      name: '泰州',
      key: '321200'
    }, {
      name: '宿迁',
      key: '321300  '
    }, {
      name: '安徽天长',
      key: '341181'
    }],
    dialogVisible: false,
    national_highway_list: [],
    listData: [], //列表数据
    pageNum: 1, //页码
    pageSize: 10, //页数
    total: 0, //列表总数
    distanse: '', //距离
    cityId: '', //城市
    roadId: '', //路线
    searchText: '',
    temporaryData: {
      distanse: '',
      cityId: '',
      roadId: ''
    }
  },
  bindconfirm(e) {
    console.log(e.detail.value)
    this.setData({
      searchText: e.detail.value
    })
    wx.nextTick(() => {
      this.onSubmit()
    })

  },
  //查询选项点击
  ItemClick(e) {
    let type = e.currentTarget.dataset.type; //当前类型
    let no = e.target.dataset.no; //当前数据
    let temporaryData = this.data.temporaryData;
    if (no && type) {
      if (no == 'all') {
        temporaryData[type] = ''
      } else {
        temporaryData[type] = no;
      }
    }
    //设置临时值
    this.setData({
      temporaryData: temporaryData
    })
  },

  //查询
  onSubmit() {
    let temporaryData = this.data.temporaryData;
    this.setData({
      pageNum: 1,
      total: 0,
      listData: [],
      distanse: temporaryData.distanse,
      cityId: temporaryData.cityId,
      roadId: temporaryData.roadId
    })
    this.getData();
  },
  // 获取列表数
  async getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let wxData = this.data;
    let param = {
      pageNum: wxData.pageNum,
      pageSize: wxData.pageSize,
      searchText: wxData.searchText,
      jd: wx.getStorageSync('myLocation').longitude, //经度
      wd: wx.getStorageSync('myLocation').latitude, //纬度
      distanse: wxData.distanse, //距离
      cityId: wxData.cityId, //城市
      roadId: wxData.roadId, //路线
    }
    let {
      data
    } = await requst_get_queryAllServiceAreaByDistanse(param)
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
    } else {
      wx.showToast({
        title: '数据获取失败',
        icon: 'none',
        duration: 1500,
        mask: true
      })
    }
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
  //列表点击
  serviceAreaItemClick(e) {
    //设置缓存
    wx.setStorageSync('serviceAreaItemInfo', e.currentTarget.dataset.info);
    wx.navigateTo({
      url: '/pages/serviceAreaInfo/serviceAreaInfo',
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
  onShow: function () {},

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