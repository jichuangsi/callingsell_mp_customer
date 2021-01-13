const app = getApp(), core = app.requirejs('core'),wxParse = app.requirejs("wxParse/wxParse");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.id&&this.setData({id:options.id});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    core.get('ele/getMessageDetail',{msg_id:that.data.id},function(res){
      console.log(res)
      that.setData({title:res.title,time:res.create_time,link_url:res.link_url})
      wxParse.wxParse("wxParseData", "html", res.details, that, "0")
    });
  },
  // 复制文本
  fz(){
    if(!this.data.link_url){
      return;
    }
    wx.setClipboardData({
      data: this.data.link_url,
      success (res) {
        console.log(res)
            core.toast(res.message,'none')
        // wx.getClipboardData({
        //   success (res) {
        //     console.log(res)
        //     core.toast(res.message,'none')
        //     // console.log(res.data) // data
        //   }
        // })
      }
    })
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

  }
})