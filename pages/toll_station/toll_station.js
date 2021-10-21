// pages/toll_station/toll_station.js
import {
  requst_get_queryAllByDistance,
  requst_get_queryAllCityLine,
  requst_get_queryAllByArea,
  requst_get_queryAllClose
} from '../../api/index.js'
import {
  markersData
} from '../../libs/markers.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    AllCityLine: {}, //城市描边信息
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
      },
      {
        name: '安徽天长',
        key: '341181'
      }
    ],
    minScale: 8, //缩放限制
    selectCity: '南京',
    cityCode: '320100',
    markers: [], //标记点数组
    polygon: [], //地图描边
    citylistData: [], //城市列表数据
    selectCityData: {},
    listData: [], //列表数据
    pageNum: 1, //页码
    pageSize: 10, //页数
    total: 0, //列表总数
    searchText: '' //搜索条件
  },
  //页签点击
  tabChange(e) {
    let current = e.target.dataset.current;
    if (current != undefined) {
      this.setData({
        current: current
      })
      if (current == 1) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 2000);
      } else {
        this.setData({
          searchText: '',
          pageNum: 1,
          listData: [],
          total: 0
        })
        wx.nextTick(() => {
          this.getData()
        })
      }
    }
  },
  //输入框确定
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
  //城市点击
  cityItemClick(e) {
    let name = e.currentTarget.dataset.name;
    let code = e.currentTarget.dataset.code;
    if (this.data.selectCity != name) {
      this.setData({
        selectCity: name,
        cityCode: code,
        selectCityData: {}
      })
      this.getgaodeAllCityLine();//高德数据描边数据获取
      // this.getqueryAllCityLine();//当前数据
      //获取城市数据
      this.getqueryAllByArea();
    }
  },
  //获取当前城市收费站数据
  async getqueryAllByArea() {
    let param = {
      pageNum: 1,
      pageSize: 999,
      jd: wx.getStorageSync('myLocation').longitude, //经度
      wd: wx.getStorageSync('myLocation').latitude, //纬度
      cityCode: this.data.cityCode
    }
    let {
      data
    } = await requst_get_queryAllByArea(param);
    if (data.code == '1001') {
      let myLocation = wx.getStorageSync('myLocation')
      var marker = [{
        id: 1,
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
        iconPath: '../../img/my_place.png',
        width: 44,
        height: 44
      }]
      this.setData({
        citylistData: data.data.records
      })
      data.data.records.forEach((item, index) => {
        let obj = {
          id: index + 2,
          latitude: item.gdLatitude,
          longitude: item.gdLongitude,
          iconPath: item.stationStateInfoList.length ? '../../img/map_restrictions.png' : '../../img/map_release.png',
          width: item.stationStateInfoList.length ? 30 : 15,
          height: item.stationStateInfoList.length ? 30 : 15,
          // joinCluster: true
        }
        marker.push(obj)
      });
      this.setData({
        markers: marker
      });
    }
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
  //设置城市描边
  setCityLine() {
    let AllCityLine = this.data.AllCityLine;
    let objKey = this.data.selectCity + '市';
    let polylineArr = AllCityLine[objKey].ployLine.split(';');
    let points = polylineArr.map(item => {
      let locationArr = item.split(',')
      return {
        longitude: locationArr[0],
        latitude: locationArr[1].split('|')[0]
      }
    })
    let center = AllCityLine[objKey].cityCenter;
    this.setData({
      latitude: center.split(',')[1],
      longitude: center.split(',')[0],
      polygon: [{
        points: points,
        fillColor: "#4F94CD33",
        strokeColor: "#4F94CD33",
        strokeWidth: 0,
        zIndex: 1
      }]
    });
  },
  async getData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let wxData = this.data;
    let param = {
      pageNum: wxData.pageNum,
      jd: wx.getStorageSync('myLocation').longitude, //经度
      wd: wx.getStorageSync('myLocation').latitude, //纬度
      pageSize: wxData.pageSize,
      searchText: wxData.searchText,
    }
    let {
      data
    } = await requst_get_queryAllByDistance(param)
    wx.hideLoading()
    if (data.code == '1001') {
      let mapData = data.data.records;
      let newData = wxData.listData.concat(mapData);
      this.setData({
        listData: newData,
        total: data.data.total,
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
  //高德获取数据
  getgaodeAllCityLine() {
    let keywords=this.data.selectCity=='安徽天长'?'天长':this.data.selectCity
    let param = {
      keywords: keywords,
      extensions: 'all',
      subdistrict: '2',
      key: markersData.webkey
    }
    wx.request({
      url: 'https://restapi.amap.com/v3/config/district',
      data: param,
      method: 'GET',
      success: (res => {
        if (res.statusCode === 200) {
          // let polylines=res.data.districts[0].polyline.split('|');
          // let polyline=polylines[0];
          // if(polylines[1]){
          //   polyline=polylines[1].length>polylines[0].length?polylines[1]:polylines[0];
          // }
          let polyline=res.data.districts[0].polyline;
          let center=res.data.districts[0].center;
          let polylineArr =polyline.split(';');
          // console.log(polylineArr)
          let points = polylineArr.map(item => {
            let locationArr = item.split(',')
            return {
              longitude: locationArr[0],
              latitude: locationArr[1].split('|')[0]
            }
          })
          this.setData({
            latitude: center.split(',')[1],
            longitude: center.split(',')[0],
            polygon: [{
              points: points,
              fillColor: "#4F94CD33",
              strokeColor: "#4F94CD33",
              strokeWidth: 0,
              zIndex: 1
            }]
          });
        } else {

        }
      }),
      fail: (res => {

      })
    })
  },
  //获取所有城市描边数据
  async getqueryAllCityLine() {
    let AllCityLine = wx.getStorageSync('AllCityLine')
    let selectCity = this.data.selectCity + "市";
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //如果已经有了就不再获取了
    if (AllCityLine[selectCity]) {
      this.setData({
        AllCityLine: AllCityLine
      })
      setTimeout(() => {
        wx.nextTick(() => {
          this.setCityLine(); //设置描边
          wx.hideLoading()
        })
      }, 1000);
      return false;
    }
    let param = {
      cityCode: this.data.cityCode
    };
    let {
      data
    } = await requst_get_queryAllCityLine(param)
    if (data.code == "1001") {
      let AllCityLine = this.data.AllCityLine;
      AllCityLine[selectCity] = data.data[selectCity];
      wx.setStorageSync('AllCityLine', AllCityLine);
      this.setData({
        AllCityLine: AllCityLine
      })
      setTimeout(() => {
        wx.nextTick(() => {
          this.setCityLine(); //设置描边
          wx.hideLoading()
        })
      }, 1000);

    } else {}
  },
  //点击标记点
  bindmarkertap(e) {
    let markerId = e.detail.markerId;
    if (markerId != '1' && markerId) {
      this.setData({
        selectCityData: this.data.citylistData[markerId - 2]
      })
    }
  },
  //获取所有的关闭信息
  async getqueryAllClose() {
    let {
      data
    } = await requst_get_queryAllClose()
    let cityList = this.data.cityList;
    cityList.forEach(item => {
      let cityName = item.name + '市';
      item.num = data.data[cityName]
    })
    this.setData({
      cityList: cityList
    })
  },
  //获取当前城市
  getcity() {
    let myLocation = wx.getStorageSync('myLocation');
    let city = myLocation.city;
    let selectCityInfo = this.data.cityList.find(item => {
      if (item.name + '市' == city) {
        return true;
      }
      return true;
    })
    if (selectCityInfo) {
      this.setData({
        selectCity: selectCityInfo.name,
        cityCode: selectCityInfo.key
      })
    }
  },
  onLoad: function (options) {
    this.getcity();
    this.getqueryAllClose(); //获取所有的关闭信息
    this.getData(); //获取列表数据
    // this.getqueryAllCityLine(); //获取描边数据
    this.getgaodeAllCityLine()
    this.getqueryAllByArea(); //获取城市信息
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
  onPullDownRefresh: function () {},

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