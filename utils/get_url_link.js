//获取当前小程序的url_link
//appid：小程序唯一凭证，即 AppID，可在「微信公众平台 - 设置 - 开发设置」页中获得。（需要已经成为开发者，且帐号没有异常状态）
//secret：小程序唯一凭证密钥，即 AppSecret，获取方式同 appid
module.exports.get_url_link = function (appid, secret) {
  //1.首选获取当前小程序的access_token
  wx.request({
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    method: 'get',
    data: {
      grant_type: 'client_credential',
      appid: appid,
      secret: secret,
    },
    success: (res => {
      if (res.statusCode === 200) {
        if (res.data.access_token) {
          //2.获取access_token后，开始获取当前urlLink,请求为post，注意的是access_token这个参数不能放在body中，需要和get一样拼接在url上
          wx.request({
            url: 'https://api.weixin.qq.com/wxa/generate_urllink?access_token=' + res.data.access_token,
            method: 'post',
            success: (res => {
              if (res.statusCode === 200) {

              } else {

              }
            }),
            fail: (res => {

            })
          })
        }
      } else {

      }
    }),
    fail: (res => {

    })
  })
}