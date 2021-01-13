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
    reason:'商品价格有误'
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
    core.get("user/OrderInfo",{id:that.data.id},function(res){
      res.error==0 && that.setData({
        stateList:res.stateList,
        address:res.address,
        order:res.order,
        goods:res.goods,
        store:res.store
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
    
    var that =this
    core.get('user/cancelOrder2',{order_id:that.data.id,userid:app.getCache('userinfo').id,reason:that.data.reason},function(res){
      console.log(res)
      core.alert(res.message);
      if(res.error==0){
        that.setData({
          showModal:!1,
        });
        core.toast('取消成功');
        
        let pages = getCurrentPages();//当前页面
        let prevPage = pages[pages.length - 2];//上一页面
          prevPage.setData({
            list:[],
            page:0,
          })
          prevPage.getMyOrder(0);
      }
    })
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
  CompleteOrder(e){
    var that=this;
    core.confirm('是否确认收货',function(){
      core.get('EleStore/finishOrder',{userid:app.getCache('userinfo').id,orderid:that.data.id,type:8},function(res){
        console.log(res)
        core.alert(res.message);
        let pages = getCurrentPages();//当前页面
        let prevPage = pages[pages.length - 2];//上一页面
        if(res.error==0){
          prevPage.setData({
            list:[],
            page:0,
          })
          prevPage.getMyOrder(2);
        }
      })
      core.post("",{},function(res){
        res.error==0 ? (
          console.log(1)
        ):console.log(1);
      });
    });
    console.log(core.pdata(e).id);
  },
  ttt(e){
    // core.alert('功能正在调整');
    var that=this;
    core.confirm('是否删除订单',function(){
      core.get('EleStore/del_order',{orderid:that.data.id,type:'user'},function(res){
        console.log(res)
        core.alert(res.message);
        let pages = getCurrentPages();//当前页面
        let prevPage = pages[pages.length - 2];//上一页面
        if(res.error==0){
          prevPage.setData({
            list:[],
            page:0,
          })
          prevPage.getMyOrder(8);
        }
      })
      core.post("",{},function(res){
        res.error==0 ? (
          console.log(1)
        ):console.log(1);
      });
    });
  },
  goToPay(e){
    console.log(core.pdata(e))
    var that = this,data = core.pdata(e),id=data.id,money=data.money,info={};
    core.get('ele/pay',{id:id,money:money},function(res){
      if(res.log_id){
        info.nonceStr=res.nonceStr;
        info.package=res.package;
        info.signType=res.signType;
        info.timeStamp=res.timeStamp;
        info.paySign=res.paySign;
      }
      // console.log(info);
      res.log_id && core.pay(info,function(res2) {
        // "requestPayment:ok" == res.errMsg && that.complete(id);
        // "requestPayment:ok" == res.errMsg && wx.requestPayment({
        //   timeStamp: res.timeStamp,  nonceStr: res.nonceStr,  package: res.package, signType: res.signType,  paySign: res.paySign,
        //   success (res) { console.log(res)},
        //   fail (res) { }
        // });
        console.log(res);
        console.log(res.order_id);
        "requestPayment:ok" == res2.errMsg  && wx.navigateTo({
          // url: '/pages/order/detail?id='+res.order_id,
          url: '/pages/order/payresult?id='+res.order_id,
        });
      });
    });
  },
  refun(){
    console.log(this.data.order)
    core.get('ele/refund',{id:this.data.order.order_id,money:this.data.order.need_pay},function(res2){
      console.log(res2)
    })
  },

  //页面跳转
  goUrl(e){
    wx.navigateTo({
      url: core.pdata(e).url,
    })
  }
})