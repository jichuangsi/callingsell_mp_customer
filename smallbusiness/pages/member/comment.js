const app = getApp(),core = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList:[],
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
    core.get("user/getcomment",{userid:app.getCache('userinfo').id,page:that.data.page},function(res){
      res.error==0&&that.setData({
        commentList:res.list,
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
  /*阅读全部*/
  readAll(e){
    var that = this,commentList = that.data.commentList,data = core.pdata(e), id = data.id, showall = data.showall;
    commentList.forEach(function(item,index){
      if(id==item.dianping_id){
        commentList[index].showAll=!showall;
        that.setData({
          commentList:commentList
        });
      }
    });
  },
  /*点击查看图片*/
  preview(t) {
    wx.previewImage({
        current: core.pdata(t).src,
        urls: core.pdata(t).urls
    });
  },
})