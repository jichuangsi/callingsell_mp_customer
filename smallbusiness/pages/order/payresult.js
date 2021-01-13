const app=getApp(),core = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticurl:app.globalData.static,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    options.id && this.setData({
      id:options.id
    });
    //没有orderid就
    !options.id && core.alert('没有订单号',wx.navigateTo({
      url: '/pages/index/index',
    }));
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
  goUrl(e){
    let id = this.data.id,type=core.pdata(e).type,url='';
    url=type=='checkOrder'?'/pages/order/detail?id='+id:'/pages/index/index';
    wx.navigateTo({
      url: url,
    })
  }
})