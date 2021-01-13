const app=getApp(),core = app.requirejs('core'),jq = app.requirejs('jquery');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radiusKM:app.getCache('radius')?app.getCache('radius'):200
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this,latitude=app.getCache('latitude'),longitude=app.getCache('longitude');
    !latitude&&!longitude&&app.getLocation(that);
    let circle=[{
      latitude: latitude,
      longitude: longitude,
      color: '#4ca2d5',
      fillColor: '#7cb5ec88',
      radius: that.data.radiusKM,
      strokeWidth: 1
    }]
    // this.getLocation();
    that.setData({latitude:latitude,longitude:longitude,circle:circle,pageView:app.globalData.pageView});
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
  getLocation(){
    var that = this;
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
     
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          circle: [{
            latitude: res.latitude,
            longitude: res.longitude,
            color: '#4ca2d5',
            fillColor: '#7cb5ec88',
            radius: 0.05,
            strokeWidth: 1
          }]
        })
      }
    })
  },
  sliderChange(e){
    // app.setCache('radius',e.detail.value,7200);
  },
  sliderChangeIng(e){
    let circle=[{
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      color: '#4ca2d5',
      fillColor: '#7cb5ec88',
      // radius: e.detail.value*1000,
      radius: e.detail.value,
      strokeWidth: 1
    }];
    this.setData({
      circle:circle,
      radiusKM:e.detail.value
    });
    // console.log(e.detail.value);
  },
  submit(){
    app.setCache('radius',this.data.radiusKM,7200);
    wx.navigateBack({
      delta: 1,
    })
  }
})