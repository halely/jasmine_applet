// pages/evaluation/evaluation.js


import {
  requst_post_evaluation,
  requst_get_evaluationIfDone
} from '../../api/index.js'
import {getevaluationVisit} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluation: '5',
    evaluationTips: [],
    evaluationRemark: '',
    evaluationText: ['使用方便', '功能实用', '路况信息准确', '界面美观', '信息不准确', '功能不好用', '界面不美观'],
    isevaluation: false //是否已经评价过
  },
  //获取是否评价信息
  async evaluationIfDone() {
    let {
      data
    } = await requst_get_evaluationIfDone()
    if (data.code == '1001') {
      if (data.data) {
        let evaluationData = data.data;
        this.setData({
          evaluation: evaluationData.evaluation,
          evaluationTips: evaluationData.evaluationTips.split(','),
          evaluationRemark: evaluationData.evaluationRemark,
          isevaluation: true
        })
      } else {
        this.setData({
          isevaluation: false
        })
      }
    }
  },
  //输入框输入
  textareaInput(e) {
    let evaluationRemark = e.detail.value;
    if (evaluationRemark.length > 200) {
      evaluationRemark = evaluationRemark.splice(0, 200)
    }
    this.setData({
      evaluationRemark: e.detail.value
    })
  },
  //星星点击
  starClick(e) {
    if (this.data.isevaluation) return false;
    let level = e.currentTarget.dataset.id;
    this.setData({
      evaluation: level
    })
  },
  //评价项点击
  evaluationTextClick(e) {
    if (this.data.isevaluation) return false;
    let text = e.currentTarget.dataset.text;
    let evaluationTips = this.data.evaluationTips;
    let index = evaluationTips.indexOf(text);
    if (index == -1) {
      evaluationTips.push(text)
    } else {
      evaluationTips.splice(index, 1)
    }
    this.setData({
      evaluationTips: evaluationTips
    })
  },
  //提交
  async submitBut() {
    let wxData = this.data;
    let param = {
      evaluationPoint: wxData.evaluation,
      evaluationTips: wxData.evaluationTips.join(','),
      evaluationRemark: wxData.evaluationRemark
    }
    let {
      data
    } = await requst_post_evaluation(param);
    if (data.code == '1001') {
      wx.showToast({
        title: data.msg,
        icon: 'none',
        duration: 2000
      })
      this.setData({
        isevaluation: true
      })
      let evaluationData = {
        evaluation: wxData.evaluation,
        evaluationTips: wxData.evaluationTips,
        evaluationRemark: wxData.evaluationRemark
      }
      wx.setStorageSync('evaluationData', evaluationData);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let evaluationData = wx.getStorageSync('evaluationData');
    // if (evaluationData) {
    //   this.setData({
    //     evaluation: evaluationData.evaluation,
    //     evaluationTips: evaluationData.evaluationTips,
    //     evaluationRemark: evaluationData.evaluationRemark,
    //     isevaluation: true
    //   })
    // }
    this.evaluationIfDone()
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
    getevaluationVisit('评价')
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