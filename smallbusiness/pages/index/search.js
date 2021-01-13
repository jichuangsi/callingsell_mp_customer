const app = getApp(), core = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showResult:0,
    page:1,
    shopid:0,
    searchHot:[{title:'鞋'},{title:'模型'},{title:'香水'},{title:'背包'},{title:'衣服'},{title:'汽车用品'},{title:'床上用品'},{title:'衣服'},{title:'首饰'}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({shopid:options.id});
    }
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
  onTextChange(e){
    this.setData({searchText:e.detail.value});
  },
  goSearch(){
    core.loading();
    var that=this,shopid=that.data.shopid,page=that.data.page,searchText=that.data.searchText;
    shopid==0 ?core.get("ele/SearchStore",{key:searchText,page:page},function(res){
      res.error==0&&that.setData({
        storeList:res.data,
        showResult:1,
      });
    }):
    core.get("ele/SearchGood",{shopid:shopid,key:searchText,page:page},function(res){
      res.error==0&&that.setData({
        goods:res.data,
        showResult:1,
      });
    });
    core.hideLoading();
  },
  goGoodDeatil(e){
    let url = e.currentTarget.dataset['url'];
    wx.navigateTo({
      url: url,
    })
  },
})