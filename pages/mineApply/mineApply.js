// pages/mineApply/mineApply.js
const app= getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyList: app.globalData.applyList,//应用数据存在全局变量中，因为其他页面也需要
    iseditor: false, //是否开启编辑
    defaultselectList: ['收费站', '过江通道', 'ETC发票', '紧急救援'], //默认项
    selectView: [],
    typeObj: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setapplyList();
    this.setTypeObj();
  },
  //设置展示项applyList数据
  setapplyList() {
    let wxData = this.data;
    //先获取缓存应用项
    let defaultselectList = wx.getStorageSync('defaultselectList');
    //如果没有就调用默认值
    if (!defaultselectList || !defaultselectList.length) defaultselectList = wxData.defaultselectList;
    this.setData({
      defaultselectList
    })
    let applyList = wxData.applyList; //所有应用项
    //根据defaultselectList设置applyList
    let selectView = [];
    //顺序生成应用数组
    defaultselectList.forEach(item => {
      applyList.find((elm,index) => {
        if(elm.name == item){
          elm.selected = true;
          elm.indexKey=index;
          selectView.push(elm);
          return true;
        }
        return false;
      })
    })
    this.setData({
      applyList,
      selectView
    })
  },
  //设置缓存应用
  setTypeObj() {
    let applyList = this.data.applyList;
    //设置typeObj
    let obj = {};
    applyList.forEach((item, index) => {
      let typeID = item.typeID;
      //绑定applyList的索引，这样可以快速找到减少复杂系数
      item.indexKey = index;
      if (!obj[typeID]) {
        obj[typeID] = {
          typeID: item.typeID,
          typeText: item.type,
          arr: [item]
        }
      } else {
        obj[typeID].arr.push(item)
      }
    })
    this.setData({
      typeObj: obj
    })

  },
  //编辑点击
  editor() {
    let {iseditor,defaultselectList}=this.data
    wx.vibrateShort();
    this.setData({
      iseditor: !iseditor
    })
    if(iseditor){
      wx.setStorageSync('defaultselectList', defaultselectList)
    }
  },
  //新增
  addApply(e) {
    let code = e.currentTarget.dataset.code;
    let {defaultselectList,selectView,applyList}=this.data;
    if (defaultselectList.length >= 4) {
      wx.showToast({
        title: '该区域最多添加4个应用超出部分请先移除后再添加',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false;
    }
    //添加选中
    applyList[code].selected = true;
    defaultselectList.push(applyList[code].name);
    selectView.push(applyList[code]);
    this.setData({
      applyList,
      selectView,
      defaultselectList
    })
    this.setTypeObj()
  },
  //删除选中项
  removeApply(e) {
    let code = e.currentTarget.dataset.code;
    //获取选中项
    let {defaultselectList,selectView,applyList}=this.data;
    if (defaultselectList.length == 1) {
      wx.showToast({
        title: '至少保留一个应用项',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false;
    }
    //取消选中
    applyList[code].selected = false;
    let index = defaultselectList.indexOf(applyList[code].name);
    defaultselectList.splice(index, 1); //移除当前项
    selectView.splice(index, 1); //移除当前项
    this.setData({
      applyList,
      selectView,
      defaultselectList
    })
    this.setTypeObj()
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