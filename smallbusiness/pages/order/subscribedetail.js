const app = getApp(),core = app.requirejs('core');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderDetail:{
        id:0,
        shopname:"麦当劳麦乐送（广州天河店）",
        goods:[{
          id:0,
          name:'双层麦辣鸡翅堡套餐',
          img:'/images/cart.png',
          spec:'规格1',
          num:2,
          price:10.00,
          marketprice:12.00,
          totalprice:20.00,
          deliveryFee:8,
          isNew:1,
          newReduce:5
        },
        {
          id:0,
          name:'双层麦辣鸡翅堡套餐2',
          spec:'规格2',
          num:2,
          price:10.00,
          marketprice:13.00,
          totalprice:20.00,
          deliveryFee:8,
          isNew:1,
          newReduce:6
        }],
    },
    picker: ['商品价格有误', '物品已售空', '其他原因'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id:options.id});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    core.get("user/getAppointmentDetail",{order_id:that.data.id},function(res){
      console.log(res)
      res.order_time = that.timestampToTime(res.order_time)
      that.setData({
        stateList:res.stateList,
        address:res.UserAddr,
        order:res,
        goods:res.goods,
        store:res.shop
      });
    });
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
  goPhone(e){
    core.phone(e);
  },
  cancelOrder(e){
    this.setData({
      showModal:!0
    });
  },
  cancelSure(){
    this.setData({
      showModal:!1
    });
    core.toast('取消成功');
  },
  PickerChange(e) {
    var reason = '',index = e.detail.value;
    reason = this.data.picker[index];
    console.log(reason);
    this.setData({
      reason:reason,
      index: e.detail.value
    })
  },
  hideModal(){
    this.setData({
      showModal:0
    });
  },
  timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
  },
  pay(){
    var that = this,info={};
    console.log(that.data.order)
    core.get('user/pay',{id:that.data.order.id,money:that.data.order.need_pay},function(res2){
      console.log(res2);
      if(res2.log_id){
        info.nonceStr=res2.nonceStr;
        info.package=res2.package;
        info.signType=res2.signType;
        info.timeStamp=res2.timeStamp;
        info.paySign=res2.paySign;
      }
      core.pay(info,function(res3) {
        console.log(res3);
        "requestPayment:ok" == res3.errMsg && wx.navigateTo({
          // url: '/pages/order/detail?id='+res.order_id,
          url: '/pages/order/payresult?id='+res.order_id,
        })
      },function(res3){
        //关闭支付时执行
        // console.log(res3);
        "requestPayment:fail cancel" == res3.errMsg && wx.navigateTo({
          url: 'pages/order/detail?id='+res.order_id,
        })
      });
    })
  }
})