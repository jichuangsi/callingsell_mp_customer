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
    //提交申请和审核通过期间，或者已经审核通过
    core.get("user/isApplyStore",{userid:app.getCache('userinfo').id},function(res){
      res.error&&core.alert(res.message,function(){
        core.newNavigateBack();
      });
    });
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
    let that = this, type=core.pdata(e).type,url="";
    type=='store'?url="/pages/member/joinus/store":url="/pages/member/joinus/stall";
    wx.navigateTo({
      url: url,
    })
  }
})