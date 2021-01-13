const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PageCur:'member',
    orderList: [{
      icon: '/images/member/order-01.png',
      badge: 120,
      name: '待付款',
      url:''
    }, {
      icon: '/images/member/order-02.png',
      badge: 1,
      name: '待发货',
      url:''
    }, {
      icon: '/images/member/order-03.png',
      badge: 0,
      name: '待收货',
      url:''
    }, {
      icon: '/images/member/order-04.png',
      badge: 22,
      name: '待评价',
      url:''
    }],
    serverList:[
    //   {
    //   icon: '/images/member/server-01.png',
    //   name: '我的会员',
    //   url:''
    // },
    {
      icon: '/images/member/server-02.png',
      name: '商家入驻',
      url:''
    },
    {
      icon: '/images/member/server-03.png',
      name: '拎手招募',
      url:''
    },
    // {
    //   icon: '/images/member/server-04.png',
    //   name: '消费统计',
    //   url:''
    // },
    {
      icon: '/images/member/server-05.png',
      name: '附近商家',
      url:''
    },
    {
      icon: '/images/member/server-06.png',
      name: '我的预约',
      url:''
    }],
    otherList:[{
      icon: '/images/member/other-01.png',
      name: '我的地址',
      url:''
    },
    {
      icon: '/images/member/other-02.png',
      name: '联系客服',
      url:''
    },
    {
      icon: '/images/member/other-03.png',
      name: '设置',
      url:''
    },
    {
      icon: '/images/member/other-04.png',
      name: '意见反馈',
      url:''
    }],
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

  },
  onLoad: function () {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    // console.log(app.globalData);
    console.log(this)
    this.newsgo()
  },
  newsgo(){
    console.log(111)
    wx.navigateTo({
      url: 'pages/member/notice/list'
    })
  },
})