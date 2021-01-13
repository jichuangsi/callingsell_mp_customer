const app = getApp(),core = app.requirejs('core');
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
    var that = this;
    core.get("user/getCollect",{userid:app.getCache('userinfo').id,page:that.data.page},function(res){
      res.error==0&&that.setData({
        list:res.list,
        page:res.page
      });
    });
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
  goGoodDeatil(e){
    let url = e.currentTarget.dataset['url'];
    wx.navigateTo({
      url: url,
    })
  },
})