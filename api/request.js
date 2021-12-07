var tokenKey = "access-token"; //缓存token对应的值
// var serverUrl = "http://192.168.50.128:8080/jasmine-web"; //刘云鹏url地址
var serverUrl = "https://96777.jssgx.cn/jasmine-web"; //生产合法域名
var tollStationUrl = "https://m.roadmall.cn/jasmine"; //服务区域名独立
// 例外不用token的地址
var exceptionAddrArr = ['/login', '/road/queryAllRoad', '/serviceArea/queryAllServiceArea', '/serviceArea/queryRoad', '/shop/queryAllShop', '/shop/shopDetail', '/road/queryAllBridge', '/station/queryAllByDistance', '/station/queryAllCityLine', '/station/queryAllByArea', '/station/queryAllClose', '/evaluation/add', '/road/queryAllRoadInfo', '/road/queryRoadInfoDetail'];

//请求头处理函数 customHeader为自定义header
function CreateHeader(url, type, customHeader = {}) {
  let header = {}
  if (type == 'POST_PARAMS') {
    header = {
      'content-type': 'application/x-www-form-urlencoded'
    }
  } else if (type == 'fileUpload') {
    header = {
      'content-type': 'multipart/form-data'
    }
  } else {
    header = {
      'content-type': 'application/json'
    }
  }
  // 当前业务需求不需要token。后续需要可以解开
  if (exceptionAddrArr.indexOf(url) == -1) { //排除请求的地址不需要token的地址
    let token = wx.getStorageSync(tokenKey);
    header['token'] = token;
  }
  header = Object.assign(header, customHeader)
  return header;
}
//token过期
function overdue() {
  wx.showToast({
    title: '账号已过期',
    icon: 'none',
    duration: 1000,
    mask: true,
    success() {
      setTimeout(() => {
        let myLocation=wx.getStorageSync('myLocation')
        wx.clearStorageSync();  
        wx.setStorageSync('myLocation', myLocation)
        wx.switchTab({
          url: '/pages/personal/personal',
        })
      }, 1000);
    }
  })
}
//请求超时
function failFnc() {
  wx.hideLoading()
  wx.showToast({
    title: '请求超时',
    icon: 'none',
    duration: 1000,
    mask: true
  })
}
//post请求，数据在body中
function postRequest(url, data, customHeader = {}) {
  let header = CreateHeader(url, 'POST', customHeader);
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverUrl + url,
      data: data,
      header: header,
      method: 'POST',
      success: (res => {
        if (res.statusCode === 200) {
          //200: 服务端业务处理正常结束
          //token过期
          if (res.data.code == 999) {
            overdue()
          } else {
            resolve(res);
          }
        } else {
          reject(res)
        }
      }),
      fail: (res => {
        failFnc();
        reject(res)
      })
    })
  })
}
//post请求，数据按照query方式传给后端
function postParamsRequest(url, data, customHeader = {}) {
  let header = CreateHeader(url, 'POST_PARAMS', customHeader);
  let useurl = url;
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverUrl + useurl,
      data: data,
      header: header,
      method: 'POST',
      success: (res => {
        if (res.statusCode === 200) {
          //200: 服务端业务处理正常结束
          //token过期
          if (res.data.code == 999) {
            overdue()
          } else {
            resolve(res);
          }
        } else {
          reject(res)
        }
      }),
      fail: (res => {
        failFnc();
        reject(res)
      })
    })
  })
}
//get 请求
function getRequest(url, data, customHeader = {}) {
  let header = CreateHeader(url, 'GET', customHeader);
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverUrl + url,
      data: data,
      header: header,
      method: 'GET',
      success: (res => {
        if (res.statusCode === 200) {
          //200: 服务端业务处理正常结束
          //token过期
          if (res.data.code == 999) {
            overdue()
          } else {
            resolve(res);
          }
        } else {
          reject(res)
        }
      }),
      fail: (res => {
        failFnc();
        reject(res)
      })
    })
  })
}
//put请求
function putRequest(url, data, customHeader = {}) {
  let header = CreateHeader(url, 'PUT', customHeader);
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverUrl + url,
      data: data,
      header: header,
      method: 'PUT',
      success: (res => {
        if (res.statusCode === 200) {
          //200: 服务端业务处理正常结束
          //token过期
          if (res.data.code == 999) {
            overdue()
          } else {
            resolve(res);
          }
        } else {
          reject(res)
        }
      }),
      fail: (res => {
        failFnc();
        reject(res)
      })
    })
  })
}
//delete请求
function deleteRequest(url, data, customHeader = {}) {
  let header = CreateHeader(url, 'DELETE', customHeader);
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverUrl + url,
      data: data,
      header: header,
      method: 'DELETE',
      success: (res => {
        if (res.statusCode === 200) {
          //200: 服务端业务处理正常结束
          //token过期
          if (res.data.code == 999) {
            overdue()
          } else {
            resolve(res);
          }
        } else {
          reject(res)
        }
      }),
      fail: (res => {
        failFnc();
        reject(res)
      })
    })
  })
}

function upImgs(imgurl, data, customHeader = {}) {
  let header = CreateHeader(imgurl, 'fileUpload', customHeader);
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: serverUrl + imgurl, //
      filePath: data,
      name: 'file',
      header: header,
      formData: null,
      success: function (res) {
        if (res.statusCode === 200) {
          //200: 服务端业务处理正常结束
          //token过期
          if (res.data.code == 999) {
            overdue()
          } else {
            resolve(res);
          }
        } else {
          reject(res)
        }
      },
      fail: (res => {
        failFnc();
        reject(res)
      })
    })


  })
}

//get 请求 ----服务区独立信息
function getRequest2(url, data, customHeader = {}) {
  let header = CreateHeader(url, 'GET', customHeader);
  return new Promise((resolve, reject) => {
    wx.request({
      url: tollStationUrl + url,
      data: data,
      header: header,
      method: 'GET',
      success: (res => {
        if (res.statusCode === 200) {
          //200: 服务端业务处理正常结束
          //token过期
          if (res.data.code == 999) {
            overdue()
          } else {
            resolve(res);
          }
        } else {
          reject(res)
        }
      }),
      fail: (res => {
        failFnc();
        reject(res)
      })
    })
  })
}

module.exports.getRequest = getRequest;
module.exports.postRequest = postRequest;
module.exports.postParamsRequest = postParamsRequest;
module.exports.putRequest = putRequest;
module.exports.deleteRequest = deleteRequest;
module.exports.upImgs = upImgs;
module.exports.getRequest2 = getRequest2;
