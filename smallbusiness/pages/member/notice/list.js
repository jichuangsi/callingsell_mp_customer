const app = getApp(), core = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    more:1,
    list:[],
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
    this.setData({
      page:1,
      list:[]
    })
    this.getNoticeList();
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
    this.data.more&&this.getNoticeList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goUrl(e){
    core.goUrl(e);
  },
  getNoticeList(){
    var that=this,noData=1,more=0,list=that.data.list,page=that.data.page;
    core.get('ele/getUserMessageList',{page:page},function(res){
      console.log(res)
      // if(res.error==0){
      //   res.list.length>0?noData=0:noData=1;
      //   res.list.length==10?more=1:more=0;
      //   list = list.concat(res.list);
      //   that.setData({list:res.list,noData:noData,more:more});
      //   return;
      // }
      if(res){
        res.length>0?noData=0:noData=1;
        res.length==10?more=1:more=0;
        page=res.length>0?page+1:page;
        list = list.concat(res);
        that.setData({list:res,noData:noData,more:more,page:page});
        return;
      }
      that.setData({noData:noData});
    });
  },
})