// app.js
App({
  onLaunch(options) {
    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    //这个最初我是在组件中获取，但是出现了一个问题，当第一次进入小程序时导航栏会把
    //页面内容盖住一部分,当打开调试重新进入时就没有问题，这个问题弄得我是莫名其妙
    //虽然最后解决了，但是花费了不少时间
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight
      }
    })
    this.checkUpdate()
  },
  checkUpdate() {
    // 版本自动更新代码
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新检测',
        content: '检测到新版本，是否重启小程序？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '已有新版本咯',
        content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索“江苏高速通”打开呦~',
        showCancel: false
      })
    })
  },
  globalData: {
    userInfo: null,
    height: 0,
    applyList: [{
        iconPath: '/svg/applySvg/tollStation.svg',
        name: '收费站',
        type: '高速路况',//类型名称
        selected: false,
        path:'toll_station',//跳转路径
        undeveloped: false, //是否未开发
        typeID: '1'//类型id
      },
      {
        iconPath: '/svg/applySvg/roadRestrictions.svg',
        name: '道路限行',
        type: '高速路况',//类型名称
        selected: false,
        path:'restrictions',//跳转路径
        undeveloped: false, //是否未开发
        typeID: '1'//类型id
      }, {
        iconPath: '/svg/applySvg/crossRiverChannel.svg',
        name: '过江通道',
        type: '高速路况',//类型名称
        selected: false,
        path:'cross_river_bridge',//跳转路径
        undeveloped: false, //是否未开发
        typeID: '1'//类型id
      }, {
        iconPath: '/svg/applySvg/liveTraffic.svg',
        name: '路况直播',
        type: '高速路况',//类型名称
        path:'',//跳转路径
        selected: false,
        undeveloped: true, //是否未开发
        typeID: '1'//类型id
      }, {
        iconPath: '/svg/applySvg/foodProducts.svg',
        name: '美食特产',
        type: '服务区专栏',//类型名称
        path:'',//跳转路径
        selected: false,
        undeveloped: true, //是否未开发
        typeID: '2'//类型id
      }, {
        iconPath: '/svg/applySvg/preferentialRefueling.svg',
        name: '优惠加油',
        type: '服务区专栏',//类型名称
        path:'',//跳转路径
        selected: false,
        undeveloped: true, //是否未开发
        typeID: '2'//类型id
      }, {
        iconPath: '/svg/applySvg/chargePolicy.svg',
        name: '收费政策',
        type: '便民服务',//类型名称
        path:'chargePolicy',//跳转路径
        selected: false,
        undeveloped: false, //是否未开发
        typeID: '3'//类型id
      }, {
        iconPath: '/svg/applySvg/emergencyRescue.svg',
        name: '紧急救援',
        type: '便民服务',//类型名称
        path:'emergencyRescue',//跳转路径
        selected: false,
        undeveloped: false, //是否未开发
        typeID: '3'//类型id
      }, {
        iconPath: '/svg/applySvg/motorwayCops.svg',
        name: '高速交警',
        type: '便民服务',//类型名称
        path:'trafficPolice',//跳转路径
        selected: false,
        undeveloped: false, //是否未开发
        typeID: '3'//类型id
      }, {
        iconPath: '/svg/applySvg/makeAccidentQuick.svg',
        name: '事故快处点',
        type: '便民服务',//类型名称
        path:'accidentManage',//跳转路径
        selected: false,
        undeveloped: false, //是否未开发
        typeID: '3'
      }, {
        iconPath: '/svg/applySvg/antiepidemic.svg',
        name: '防疫政策',
        type: '便民服务',//类型名称
        selected: false,
        path:'',//跳转路径
        externallinks:'http://www.gov.cn/zhuanti/2021yqfkgdzc/mobile.htm',//外部链接
        undeveloped: false, //是否未开发
        typeID: '3'//类型id
      },{
        iconPath: '/svg/applySvg/complaintsPraise.svg',
        name: '投诉表扬',
        type: '便民服务',//类型名称
        selected: false,
        path:'',//跳转路径
        undeveloped: true, //是否未开发
        typeID: '3'//类型id
      }, {
        iconPath: '/svg/applySvg/lostFound.svg',
        name: '失物招领',
        type: '便民服务',//类型名称
        selected: false,
        path:'',//跳转路径
        undeveloped: true, //是否未开发
        typeID: '3'//类型id
      }, {
        iconPath: '/svg/applySvg/ETC_Add.svg',
        name: 'ETC新办',
        type: '高速营业厅',//类型名称
        selected: false,
        shortLink:'#小程序://中国ETC服务/中国ETC服务/yA7V1WRvePFvhmy',//小程序跳转
        path:'',//跳转路径
        undeveloped: false, //是否未开发
        typeID: '4'//类型id
      }, {
        iconPath: '/svg/applySvg/ETC_Activation.svg',
        name: 'ETC激活',
        type: '高速营业厅',//类型名称
        selected: false,
        shortLink:'#小程序://中国ETC服务/中国ETC服务/yA7V1WRvePFvhmy',//小程序跳转
        path:'',//跳转路径
        undeveloped: false, //是否未开发
        typeID: '4'//类型id
      }, {
        iconPath: '/svg/applySvg/transitTrade.svg',
        name: '通行交易',
        type: '高速营业厅',//类型名称
        selected: false,
        shortLink:'#小程序://中国ETC服务/中国ETC服务/yA7V1WRvePFvhmy',//小程序跳转
        path:'',//跳转路径
        undeveloped: false, //是否未开发
        typeID: '4'//类型id
      }, {
        iconPath: '/svg/applySvg/ETC_Invoice.svg',
        name: 'ETC发票',
        shortLink:'#小程序://票根/wRVjYY7O6GYwsSj',//小程序跳转
        type: '高速营业厅',//类型名称
        selected: false,
        path:'',//跳转路径
        undeveloped: false, //是否未开发
        typeID: '4'//类型id
      }, {
        iconPath: '/svg/applySvg/Green_Booking.svg',
        name: '绿通车预约',
        type: '高速营业厅',//类型名称
        selected: false,
        shortLink:'#小程序://中国ETC服务/中国ETC服务/yA7V1WRvePFvhmy',//小程序跳转
        path:'',//跳转路径
        undeveloped: false, //是否未开发
        typeID: '4'//类型id
      },
      {
        iconPath: '/svg/applySvg/container_Car.svg',
        name: '集装箱车辆预约',
        type: '高速营业厅',//类型名称
        selected: false,
        shortLink:'#小程序://中国ETC服务/中国ETC服务/yA7V1WRvePFvhmy',//小程序跳转
        path:'',//跳转路径
        undeveloped: false, //是否未开发
        typeID: '4'//类型id
      },
      {
        iconPath: '/svg/applySvg/harvester.svg',
        name: '收割机运输车辆预约',
        type: '高速营业厅',//类型名称
        shortLink:'#小程序://中国ETC服务/中国ETC服务/yA7V1WRvePFvhmy',//小程序跳转
        selected: false,
        path:'',//跳转路径
        undeveloped: false, //是否未开发
        typeID: '4'//类型id
      }
    ]//我的应用
  }
})