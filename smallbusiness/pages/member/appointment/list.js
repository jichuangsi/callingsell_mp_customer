const app=getApp(),core = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 1,
    page:1,
    show:true,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getcurrent()
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
    console.log(4444)
    if(this.data.show){
      var TabCur = this.data.TabCur==1?0:9
      this.getcurrent(TabCur)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tabSelect(e) {
    var id = core.pdata(e).id;
    this.setData({
      TabCur: id,
      scrollLeft: (id-1)*60,
      page:1,
      show:true,
      list:[]
    })
    var TabCur = id==1?0:9
    this.getcurrent(TabCur)
  },
  _getOrder(e){
    wx.navigateTo({
      url: '/pages/order/subscribedetail?id='+e.currentTarget.dataset.id,
    });
  },
  _getcurrent(e){
    wx.navigateTo({
      url: '/pages/member/appointment/currentlist?id='+e.currentTarget.dataset.id,
    });
  },
  getcurrent(status){
    core.loading();
    var that = this,page=that.data.page,show=that.data.show;
    core.get('user/getMyAppointmentList',{page:page,userid:app.getCache('userinfo').id,status:status},function(res){
      console.log(res)
      var list = that.data.list;
      if(res&&res.length>0){
        page = page+1
        show= true
        list.push(...res)
        that.setData({
          page:page,
          show:show,
          list:list
        });
      }
      core.hideLoading();
    });
  }
})