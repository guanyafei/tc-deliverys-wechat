const { baseUrl,shopBaseUrl} = require('./env').dev;
module.exports = {
  request: function (url, method, data,tip='系统提示',subTitle='登录失效，是否重新登录?') {
    let fullUrl = `${baseUrl}${url}`;
    wx.showLoading({
      title: '加载中',
    })
    let  token ="Bearer "+wx.getStorageSync('token');
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success(res){
          if(res.networkType == 'none'){
            wx.showToast({
              title: '网络连接失败',
              icon:'none',
              duration: 3000
            })
          }else{
            wx.request({
              url: fullUrl,
              method:method,
              data,
              header: {
                'Authorization': token,
              },
              success(res){
                wx.hideLoading()
                if(res.data.code===200){
                  resolve(res.data)
                }else if(res.data.code===401){
                  wx.clearStorage()
                  wx.showModal({
                    title: tip,
                    content: subTitle,
                    confirmText:'确定',
                    confirmColor:'#417CF7',
                    success (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                        // wx.navigateTo({
                        //   url: '/pagesB/login/index'
                        // })
                      } else if (res.cancel) {
                        wx.switchTab({
                          url: '/pages/home/index'
                        })
                      }
                    }
                  })
                }else if(res.data.code==201){
                  resolve(res.data)
                }else if(res.data.code==202){
                  resolve(res.data)
                }else{
                  resolve(res.data)
                  wx.showToast({
                    title: res.data.msg,
                    icon:'none',
                    duration: 3000
                  })
                }
              },
              fail(error){
                wx.showToast({
                  title: '请求失败，请重试',
                  icon:'none',
                  duration: 3000
                })
                reject('请求失败')
              }
            })
          }
        }
      })
    })
  },
  // 支付相关
  request2: function (url, method, data) {
    let fullUrl = `${baseUrl}${url}`;
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success(res){
          if(res.networkType == 'none'){
            wx.showToast({
              title: '网络连接失败',
              icon:'none',
              duration: 3000
            })
          }else{
            wx.request({
              url: fullUrl,
              method:method,
              data,
              success(res){
                wx.hideLoading()
                if(res.data.code===200 || res.data.responseCode === '200'){
                  resolve(res.data)
                }else if(res.data.code===401){
                  wx.clearStorage()
                  wx.showModal({
                    title: '系统提示',
                    content: '登录失效，是否重新登录?',
                    confirmText:'确定',
                    confirmColor:'#417CF7',
                    success (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                        // wx.navigateTo({
                        //   url: '/pagesB/login/index'
                        // })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }else if(res.data.responseCode === '999'){
                  resolve(res.data)
                  wx.showToast({
                    title: res.data.responseMsg1,
                    icon:'none',
                    duration: 3000
                  })
                }else{
                  resolve(res.data)
                  wx.showToast({
                    title: res.data.msg,
                    icon:'none',
                    duration: 3000
                  })
                }
              },
              fail(error){
                wx.showToast({
                  title: '请求失败，请重试',
                  icon:'none',
                  duration: 3000
                })
                reject('请求失败')
              }
            });
          }
        }
      })
    })
  },
  // 商家工作台
  request3: function (url, method, data,tip='系统提示',subTitle='登录失效，是否重新登录?') {
    let fullUrl = `${shopBaseUrl}${url}`;
    wx.showLoading({
      title: '加载中',
    })
    let  token ="Bearer "+wx.getStorageSync('token');
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success(res){
          if(res.networkType == 'none'){
            wx.showToast({
              title: '网络连接失败',
              icon:'none',
              duration: 3000
            })
          }else{
            wx.request({
              url: fullUrl,
              method:method,
              data,
              header: {
                'Authorization': token,
              },
              success(res){
                wx.hideLoading()
                if(res.data.code===200){
                  resolve(res.data)
                }else if(res.data.code===401){
                  wx.clearStorage()
                  wx.showModal({
                    title: tip,
                    content: subTitle,
                    confirmText:'确定',
                    confirmColor:'#417CF7',
                    success (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                        // wx.navigateTo({
                        //   url: '/pagesB/login/index'
                        // })
                      } else if (res.cancel) {
                        wx.switchTab({
                          url: '/pages/home/index'
                        })
                      }
                    }
                  })
                }else if(res.data.code==201){
                  resolve(res.data)
                }else if(res.data.code==202){
                  resolve(res.data)
                }else{
                  resolve(res.data)
                  wx.showToast({
                    title: res.data.msg,
                    icon:'none',
                    duration: 3000
                  })
                }
              },
              fail(error){
                wx.showToast({
                  title: '请求失败，请重试',
                  icon:'none',
                  duration: 3000
                })
                reject('请求失败')
              }
            })
          }
        }
      })
    })
  },
}