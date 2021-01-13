const app=getApp(),core = app.requirejs("core");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticurl:app.globalData.static,
    ListTouchDirection:null,
    modalName:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    core.loading();
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
    this.setData({
      ListTouchDirection:null,
      modalName:null
    });
    this.getAddressList(),core.hideLoading();
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
  getAddressList(){
    var that = this;
    core.get("user/getAddressList",{},function(res){
      res.error==0 && that.setData({
        addressList:res.list
      });
    });
  },
  goAddAddress(){
    wx.navigateTo({
      url: '/pages/member/address/post',
    })
  },
  editAddress(e){
    var id = core.pdata(e).id;
    wx.navigateTo({
      url: '/pages/member/address/post?id='+id,
    })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    var type='',result = e.touches[0].pageX - this.data.ListTouchStart;
    type= result > 0 ? 'right':result<0? 'left':'click';
    this.setData({
      // ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
      ListTouchDirection: type
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection =='left'||this.data.ListTouchDirection =='click'){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null,
        ListTouchDirection: null
      })
      // this.setData({
      //   ListTouchDirection: null
      // })
    }
    // this.setData({
    //   ListTouchDirection: null
    // })
  },
  deleteAddress(e){
    var that=this,id = core.pdata(e).id;
    core.get("user/deleteAddress",{addressid:id},function(res){
      res.error==0&&that.setData({modalName: null,ListTouchDirection: null}),core.success(res.message);
      setTimeout(function() {
        that.getAddressList();
      },1300);;
    });
  },
})