// pages/serviceArea/serviceArea.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conditionSelect:'',
    cityList:[{
      name:'南京',
      key:'320100'
    },{
      name:'无锡',
      key:'320200'
    },{
      name:'徐州',
      key:'320300  '
    },{
      name:'常州',
      key:'320400'
    },{
      name:'苏州',
      key:'320500'
    },{
      name:'南通',
      key:'320600'
    },{
      name:'连云港',
      key:'320700'
    },{
      name:'淮安',
      key:'320800'
    },{
      name:'盐城',
      key:'320900'
    },{
      name:'扬州',
      key:'321000'
    },{
      name:'镇江',
      key:'321100'
    },{
      name:'泰州',
      key:'321200'
    },{
      name:'宿迁',
      key:'321300  '
    },{
      name:'安徽天长',
      key:'341181'
    }],
    dialogVisible:false,
    national_highway_list:['沈海高速','盐靖高速','盐洛高速','常嘉高速','常台高速','京沪高速','长深高速','南京绕城高速','淮徐高速','京台高速','连霍高速','宁洛高速','沪陕高速','扬溧高速','沪蓉高速','宁芜高速','沪武高速','沪渝高速']
  },
  //选择项
  queryClick(e){
    let selectid=e.currentTarget.dataset.id;
    if(selectid!=undefined){
      this.setData({
        conditionSelect:selectid,
        dialogVisible:true
      })
    }
  },
  closeDialog(){
    this.setData({
      conditionSelect:'',
      dialogVisible:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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