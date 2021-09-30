// pages/cross_river_bridge/cross_river_bridge.js、

import {
  requst_get_queryAllBridge
} from '../../api/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    kc: [],
    hc: [],
    bridgeNodeList: [{
      name: '大胜关',
      itemPosition: {
        top: '100px',
        left: 0
      },
      rotate: 'rotate(-90deg)',
      textPosition: {
        top: '6px',
        left: '25px'
      },
    }, {
      name: '栖霞山',
      itemPosition: {
        top: '30px',
        left: 0
      },
      rotate: 'rotate(-55deg)',
      textPosition: {
        top: '20px',
        left: '25px'
      },
    }, {
      name: '润扬',
      itemPosition: {
        top: '-11px',
        left: '30px'
      },
      rotate: 'rotate(-45deg)',
      textPosition: {
        top: '-25px',
        left: '-31px'
      },
    }, {
      name: '五峰山',
      itemPosition: {
        top: '-11px',
        left: '80px'
      },
      rotate: 'rotate(0deg)',
      textPosition: {
        top: '40px',
        left: '-25px'
      },
    }, {
      name: '泰州',
      itemPosition: {
        top: '-11px',
        left: '120px'
      },
      rotate: 'rotate(0deg)',
      textPosition: {
        top: '-25px',
        left: '-23px'
      },
    }, {
      name: '江阴',
      itemPosition: {
        top: '-11px',
        left: '160px'
      },
      rotate: 'rotate(0deg)',
      textPosition: {
        top: '40px',
        left: '-23px'
      },
    }, {
      name: '沪苏通',
      itemPosition: {
        top: '-11px',
        left: '200px'
      },
      rotate: 'rotate(0deg)',
      textPosition: {
        top: '-25px',
        left: '-23px'
      },
    }, {
      name: '苏通',
      itemPosition: {
        top: '-11px',
        left: '240px'
      },
      rotate: 'rotate(0deg)',
      textPosition: {
        top: '40px',
        left: '-23px'
      },
    }, {
      name: '崇启',
      itemPosition: {
        top: '-11px',
        left: '280px'
      },
      rotate: 'rotate(0deg)',
      textPosition: {
        top: '-25px',
        left: '-23px'
      },
    }],
    seletObj: {},

    selectItembridge: {},
    current: 0
  },
  async getQueryAllBridge() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let {
      data
    } = await requst_get_queryAllBridge();
    wx.hideLoading()
    if (data.code == '1001') {
      //临时数据
      let tempArr = [{
          bridgeId: null,
          bridgeName: "江阴",
          dir: "双向",
          dirDes: "双向",
          eventDetail: "国庆期间，江阴大桥继续实施黄牌货车限时错峰出行政策，限行时间9月30日12：00-10月1日22：00、10月6日和7日每日8：00-22：00，限行路段为 G2京沪高速正谊枢纽至峭岐枢纽、G1515盐靖高速桥头枢纽至广陵枢纽。",
          eventTypeId: 4,
          eventTypeSubId: 3,
          reportId: "12385879",
          roadDirId: "G0002003",
          vehicleModel: null
        },
        {
          bridgeId: null,
          bridgeName: "苏通",
          dir: "双向",
          dirDes: "双向",
          eventDetail: "国庆期间，苏通大桥继续实施黄牌货车限时错峰出行政策，限行时间9月30日12：00-10月1日22：00、10月6日和7日每日8：00-22：00，限行路段为 G15沈海高速兴东枢纽至董浜枢纽。",
          eventTypeId: 4,
          eventTypeSubId: 3,
          reportId: "12385879",
          roadDirId: "G0002003",
          vehicleModel: null
        }, {
          bridgeId: null,
          bridgeName: "崇启",
          dir: "双向",
          dirDes: "双向",
          eventDetail: "国庆期间，崇启大桥继续实施黄牌货车限时错峰出行政策，限行时间9月30日12：00-10月1日22：00、10月6日和7日每日8：00-22：00，限行路段为 G40沪陕高速启东北枢纽至崇启大桥主线站。",
          eventTypeId: 4,
          eventTypeSubId: 3,
          reportId: "12385879",
          roadDirId: "G0002003",
          vehicleModel: null
        }
      ]
    let hcArr = data.data.hc;
    hcArr = tempArr.concat(hcArr)
    this.setData({
      hc: hcArr || [],
      kc: data.data.kc || []
    })
    this.macthbridge()
  }

},
//处理当前类型数据
macthbridge() {
  let wxData = this.data;
  let carData = [];
  if (wxData.current == 0) {
    carData = wxData.hc
  } else {
    carData = wxData.kc
  }
  let obj = {};
  carData.forEach(item => {
    if (!obj[item.bridgeName]) obj[item.bridgeName] = {};
    obj[item.bridgeName].name = item.bridgeName;
    if (!obj[item.bridgeName].eventDetail) {
      obj[item.bridgeName].eventDetail = []
    }
    // if (item.eventTypeId == 4 && !item.eventTypeSubId) {
    //   //常态关闭不显示
    //   obj[item.bridgeName].normal = true;
    //   obj[item.bridgeName].eventDetail.push(item);
    //   return false
    // }
    if (item.dir == "下行") {
      obj[item.bridgeName].left = true;
    } else if (item.dir == "上行") {
      obj[item.bridgeName].right = true;
    } else if (item.dir == "双向") {
      obj[item.bridgeName].left = true;
      obj[item.bridgeName].right = true;
    }
    obj[item.bridgeName].eventDetail.push(item)
  })
  this.setData({
    seletObj: obj
  })
},
bridgeClick(e) {
  let iteminfo = e.currentTarget.dataset.iteminfo;
  let newObj = {};
  if (typeof iteminfo == 'string') {
    newObj = {
      name: iteminfo
    }
  } else {
    newObj = iteminfo;
  }
  this.setData({
    selectItembridge: newObj
  })
},
tabChange(e) {
  let current = e.currentTarget.dataset.current;
  if (current != undefined) {
    if (current != this.data.current) {
      this.setData({
        current: current,
        selectItembridge: {}
      })
      this.macthbridge()
    }
  }
},
/**
 * 生命周期函数--监听页面加载
 */
onLoad: function (options) {
  if (options.type == 'kc') {
    this.setData({
      current: 1
    })
  }
  this.getQueryAllBridge()
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