// pages/articleView/articleView.js
import {
  Base64
} from '../../utils/util'

import {
  requst_get_addHandyChargePolicy,
  requst_get_addHandyNotice
} from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    html: '',
    title:'',
    articleData:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type;
    this.setData({
      type
    })
    this.setHtml();
    this.addreading()
  },
  setHtml() {
    let articleData = wx.getStorageSync('articleData');
    let base = new Base64();//保证引入路径真确
    let htmlTpl='';
    let title="";
    if(this.data.type=='policy'){
      htmlTpl = base.decode(articleData.policyContent);
      title=articleData.policyTitle;
    }else{
      htmlTpl = base.decode(articleData.noticeContent);
      title=articleData.noticeTitle;
    }
    wx.setNavigationBarTitle({
      title: title 
    })
    this.setData({
      html:htmlTpl,
      articleData:articleData,
      title
    })
  },
  //进入添加阅读量
  async addreading(){
    let temporaryMethod=null;
    let param={};
    if(this.data.type=='policy'){
      temporaryMethod=requst_get_addHandyChargePolicy;
      param={
        policyId:this.data.articleData.policyId
      }
    }else{
      temporaryMethod=requst_get_addHandyNotice;
      param={
        noticeId:this.data.articleData.noticeId
      }
    }
    let data=await temporaryMethod(param)
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