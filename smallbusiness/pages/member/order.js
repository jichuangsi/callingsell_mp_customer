const { loading } = require("../../utils/core");

const app = getApp(), core = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    show:0,
    statusTab: 1,
    status:-1,
    page:0,
    cansubmit:1,
    list:[],
    loading:0,
    hasMore:1,
    picker: ['商品价格有误', '物品已售空', '其他原因'],
    orderid:'',
    reason:'商品价格有误'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.statusTab){
      that.setData({
        statusTab:options.statusTab,
        status:options.status
      });
    }
    // this.getMyOrder(this.data.status);
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
    this.getMyOrder(this.data.status);
    core.hideLoading();
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
    var status=this.data.status;
    !this.data.loading&&this.data.hasMore&&this.getMyOrder(status);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tabSelect(e) {
    this.setData({
      statusTab: core.pdata(e).index,
      hasMore:1,
      list:[],
    }),this.getMyOrder(core.pdata(e).status);
  },
  getMyOrder(newstatus){
    this.setData({loading:1});
    core.loading();
    var that = this,page=that.data.page,status=that.data.status;
    if(status == newstatus){
      page+=1;
    } else{
      page=1,status=newstatus,that.setData({list:[],status:status})
    }
    // status == newstatus ? page+=1:(page=1,status=newstatus,that.setData({status:status}));
    console.log(status == newstatus);
    console.log(that.data);
    that.data.hasMore&&core.get('user/myorder',{page:page,status:status},function(res){
      var list = that.data.list,show=that.data.show;
      res.order?(list=list.concat(res.order),that.setData({hasMore:1}) ):that.setData({hasMore:0});
      list.length ? show=0:show=1;
      list.length ? console.log(1):console.log(0);
      res.error==0 && that.setData({
        list:list,
        page:page,
        show:show,
        loading:0,
      });
      core.hideLoading();
    });
  },
  CompleteOrder(e){
    var that=this;
    core.confirm('是否确认收货',function(){
      core.get('EleStore/finishOrder',{userid:app.getCache('userinfo').id,orderid:core.pdata(e).id,type:8},function(res){
        console.log(res)
        core.alert(res.message);
        if(res.error==0){
          that.setData({
            list:[],
            page:0,
          })
          that.getMyOrder(2);
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
  goToPay(e){
    var that = this,data = core.pdata(e),id=data.id,money=data.money,info={};
    that.data.cansubmit==1 && core.get('ele/pay',{id:id,money:money},function(res){
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
  //催单
  reminder(){
    core.alert('已通知商家，将尽快安排配送');
  },
  ttt(e){
    // core.alert('功能正在调整');
    var that=this;
    core.confirm('是否删除订单',function(){
      core.get('EleStore/del_order',{orderid:core.pdata(e).id,type:'user'},function(res){
        console.log(res)
        core.alert(res.message);
        if(res.error==0){
          that.setData({
            list:[],
            page:0,
          })
          that.getMyOrder(8);
        }
      })
      core.post("",{},function(res){
        res.error==0 ? (
          console.log(1)
        ):console.log(1);
      });
    });
  },
  //页面跳转
  goUrl(e){
    wx.navigateTo({
      url: core.pdata(e).url,
    })
  },
  cancelOrder(e){
    this.setData({
      showModal:!0,
      orderid:e.currentTarget.dataset.id
    });
  },
  hideModal(e){
    this.setData({
      showModal:!1
    });
  },
  cancelSure(e){
    console.log(e)
    var that =this
    core.get('user/cancelOrder2',{order_id:that.data.orderid,userid:app.getCache('userinfo').id,reason:that.data.reason},function(res){
      console.log(res)
      core.alert(res.message);
      if(res.error==0){
        that.setData({
          showModal:!1,
          list:[],
          page:0,
        });
        core.toast('取消成功');
        that.getMyOrder(0);
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
})