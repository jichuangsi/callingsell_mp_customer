const app = getApp(),core=app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PageCur:"store",
    storeCate:{1:'超市',2:'便利店',3:'肉菜市场',4:'新鲜水果',5:'餐饮'},
    storeList:[],
    staticurl:app.globalData.static,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    core.loading();
    var that=this;
    options.type && that.setData({
      category:options.type
    }),this.getStoreList();
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
  getStoreList(){
    var that=this,storeList=that.data.storeList;
    core.get("ele/StoreList",{category:that.data.category},function(res){
      // res.error==0? storeList=storeList.concat(res.list):'';
      if(res.error==0&&res.list){
        storeList=storeList.concat(res.list)
      }
      console.log(storeList.length);
      res.error==0 && that.setData({
        storeList:storeList,
        noData:storeList.length?0:1,
      }),core.hideLoading();
    })
  },
})