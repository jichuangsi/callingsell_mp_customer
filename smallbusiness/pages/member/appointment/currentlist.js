const app=getApp(),core = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    id:'',
    item:'',
    // multiArray:['微信支付','货到到付'],
    multiArray:['货到到付'],
    grabbing_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id:options.id
    })
    this.getdata(options.id)
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
  // 选择商家
  check(e){
    this.setData({
      grabbing_id:e.currentTarget.dataset.id
    })
  },
  // 支付状态选择确认
  CategoryChange(e){
    var that = this;
    console.log(e)
    // if(e.currentTarget.dataset.value==1){
    //   core.get('ele/pay',{id:res.order_id,money:totalprice},function(res2){
    //     console.log(res2);
    //     if(res2.log_id){
    //       info.nonceStr=res2.nonceStr;
    //       info.package=res2.package;
    //       info.signType=res2.signType;
    //       info.timeStamp=res2.timeStamp;
    //       info.paySign=res2.paySign;
    //     }
    //     res2.log_id && core.pay(info,function(res3) {
    //       console.log(res3);
    //       if("requestPayment:ok" == res3.errMsg){
            
    //       }
    //     },function(res3){
    //       //关闭支付时执行
    //       // console.log(res3);
    //       if("requestPayment:fail cancel" == res3.errMsg){

    //       }
    //     });
    //   });
    // }else{
    //   core.get('user/addAppointmentOrder',{grabbing_id:that.data.grabbing_id,code:2,userid:app.getCache('userinfo').id},function(res){
    //     console.log(res)
    //     core.alert(res.message);
    //     if(res.error=='0'){
    //       let pages = getCurrentPages();//当前页面
    //       let prevPage = pages[pages.length - 2];//上一页面
    //       prevPage.setData({//直接给上移页面赋值
    //         page:1,
    //         show:true,
    //         list:[]
    //       });
    //       var TabCur = prevPage.data.TabCur==1?0:9
    //       prevPage.getcurrent(TabCur)
    //     }
    //   });
    // }
    core.get('user/addAppointmentOrder',{grabbing_id:that.data.grabbing_id,code:2,userid:app.getCache('userinfo').id},function(res){
      console.log(res)
      core.alert(res.message);
      if(res.error=='0'){
        let pages = getCurrentPages();//当前页面
        let prevPage = pages[pages.length - 2];//上一页面
        prevPage.setData({//直接给上移页面赋值
          page:1,
          show:true,
          list:[]
        });
        var TabCur = prevPage.data.TabCur==1?0:9
        prevPage.getcurrent(TabCur)
      }
    });
  },
  // 取消预约
  qxbtn(){
    var that = this;
    core.get('user/cancelReservationOrder',{order_id:that.data.id,userid:app.getCache('userinfo').id},function(res){
      console.log(res)
      core.alert(res.message);
      if(res.error=='0'){
        let pages = getCurrentPages();//当前页面
        let prevPage = pages[pages.length - 2];//上一页面
        prevPage.setData({//直接给上移页面赋值
          page:1,
          show:true,
          list:[]
        });
        var TabCur = prevPage.data.TabCur==1?0:9
        prevPage.getcurrent(TabCur)
      }
    })
  },
  none(){
    this.setData({
      show:false
    })
  },
  getdata(id){
    core.loading();
    var that = this;
    core.get('user/getAppointmentDetail',{order_id:id},function(res){
      console.log(res)
      that.setData({
        item:res
      })
      core.hideLoading();
    });
  }
})