const app = getApp(),core = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectAddressModal:!1,
    selectPayTypeModal:!1,
    contentLength:0,
    minLength:10,
    maxLength:150,
    postData:{},
    payname:"请选择支付方式",
    canSubmit:1,
    Distributionstatus:false,
    // paytype: [{type:0,typename:'请选择支付方式'},{type:1,typename:'支付宝'}, {type:2,typename:'微信支付'}, {type:3,typename:'货到付款'}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      goodid:options.goodid,
      shopid:options.shopid,
      type:options.type,
      selectall:options.selectall,
      goodData:options.goods,
    });
    console.log(this.data);
    core.loading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // var that=this,postData=that.data.postData;
    // core.get("ele/createOrder",{goodid:that.data.goodid,shopid:that.data.shopid,userid:app.getCache('userinfo').id,type:that.data.type},function(res){
    //   res.error==0 && that.setData({
    //     cartid:res.cartid,
    //     address:res.address,
    //     goods:res.goods,
    //     store:res.store,
    //     payway:res.payway,
    //     totalprice:res.totalprice
    //   }),core.hideLoading();
    //   if(that.data.address[0].is_default==1){
    //     postData.addressid=that.data.address[0].addr_id;
    //     // var goods=[];
    //     // that.data.goods.forEach(function(item,index){
    //     //   goods[index]=item['product_id'];
    //     // });
    //     // postData.goods=goods;
    //     // postData.goods=that.data.goods;
    //     // postData.totalprice=that.data.totalprice;
    //     // that.setData({
    //     //   addressinfo:that.data.address[0],
    //     //   postData:postData
    //     // });
    //   }
    //   postData.cartid=that.data.cartid;
    //   postData.goods=that.data.goods;
    //   postData.totalprice=that.data.totalprice;
    //   that.setData({
    //     addressinfo:that.data.address[0],
    //     postData:postData
    //   });
    // });
    // console.log(this.data);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddressList();
    var that = this,postData=that.data.postData;
    postData.shopid=that.data.shopid;
    core.get("ele/createOrder",{
      goodid:that.data.goodid,shopid:that.data.shopid,userid:app.getCache('userinfo').id,type:that.data.type,
      goods:that.data.goodData,selectall:that.data.selectall},function(res){
      res.error==0 && that.setData({
        cartid:res.cartid,
        address:res.address,
        goods:res.goods,
        store:res.store,
        payway:res.payway,
        totalprice:res.totalprice,
        fullReduce:res.fullReduce,
        newMoney:res.newMoney,
      }),core.hideLoading();
      if(that.data.address[0].is_default==1){
        postData.addressid=that.data.address[0].addr_id;
      }
      postData.cartid=that.data.cartid;
      postData.goods=that.data.goods;
      postData.totalprice=that.data.totalprice;
      that.setData({
        addressinfo:that.data.address[0],
        postData:postData
      });
      console.log(that.data.address[0].addr_id)
      console.log(that.data.address[0].lat)
      console.log(that.data.address[0].lng)
      core.get('user/judgeOutOfRange',{userid:app.getCache('userinfo').id,shop_id:that.data.shopid,address_id:that.data.address[0].addr_id},function(res){
        console.log(111)
        console.log(res)
        that.setData({
          Distributionstatus:false,
        });
        if(res.message=='允许配送'){
          that.setData({
            Distributionstatus:true,
          });
        }
      });
    });
  },
  getAddressList(){
    var that=this,postData=that.data.postData;
    core.get("user/getAddressList",{userid:app.getCache('userinfo').id},function(res){
      res.error==0 && that.setData({
        address:res.list,
      }),core.hideLoading();
      if(that.data.address[0].is_default==1){
        postData.addressid=that.data.address[0].addr_id;
        postData.goods=that.data.goods;
        postData.totalprice=that.data.totalprice;
        that.setData({
          addressinfo:that.data.address[0],
          postData:postData
        });
      }
    });
    that.setData({
      postData:postData
    });
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
  /*  */
  showModal(e){
    var type = core.pdata(e).type;
    if(type=='address'){
      this.setData({
        selectAddressModal:!0
      });
    } else{
      this.setData({
        selectPayTypeModal:!0
      });
    }
  },
  hideModal(e) {
    var type = core.pdata(e).type;
    if(type=='address'){
      this.setData({
        selectAddressModal:!1
      });
    } else{
      this.setData({
        selectPayTypeModal:!1
      });
    }
  },
  selectPayType(){
    var that=this,payway=this.data.payway,payindex = this.data.payindex,payname=this.data.payname,code='';
      payname =  payindex? payway[payindex].payname:payway[0].payname;
      code =  payindex? payway[payindex].code:payway[0].code;
      this.setData({
        payname:payname,
        code:code,
        selectPayTypeModal:!1
      });

    // payname =  index? payway[index].payname:payway[0].payname;
    // code =  index? payway[index].code:payway[0].code;
    // this.setData({
    //   payname:payname,
    //   code:code,
    //   selectPayTypeModal:!1
    // });
  },
  PickerChange(e) {
    var that=this,payname = '',payway=this.data.payway,index = e.detail.value[0],code,payTypeInterval=setInterval(function() {
      console.log(index);
      payname =  index? payway[index].payname:payway[0].payname;
      code =  index? payway[index].code:payway[0].code;
      that.setData({
        payname:payname,
        code:code,
        payindex:index
      }),clearInterval(payTypeInterval);
    },400);
    // this.setData({
    //   index: index
    // })
    // console.log(e);
  },
  bindpickend(e){
    console.log(e);
  },
  onTextAreaChange(e){
    var content = e.detail.value,data = this.data,maxLength = data.maxLength,minLength = data.minLength;
    if(content.length<=maxLength){
      this.setData({
        contentLength:content.length
      });
      return core.onDataChange(this,e);
    } else{
      var postData=data.postData,message = '内容最多'+maxLength+'个字';
      core.alert(message);
      this.setData({
        postData:postData,
        contentLength:data.contentLength
      });
    }
  },
  /* 选择地址 */
  selectAddress(e){
    var that=this,postData = that.data.postData;
    postData['addressid'] = core.pdata(e).id;
    core.get('user/getAddress',{id:postData['addressid']},function(res){
      res.error==0 && that.setData({
        addressinfo:res.address
      });
    });
    that.setData({
      postData:postData,
      selectAddressModal:!1
    });
    core.get('user/judgeOutOfRange',{userid:app.getCache('userinfo').id,shop_id:that.data.shopid,address_id:postData.addressid},function(res){
      console.log(111)
      console.log(res)
      that.setData({
        Distributionstatus:false,
      });
      if(res.message=='允许配送'){
        that.setData({
          Distributionstatus:true,
        });
      }
    });
  },
  /* 去增加收货地址 */
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
  //支付
  goPay(){
    var that = this,postData=that.data.postData,totalprice=that.data.totalprice,canSubmit=that.data.canSubmit,info={};
    if(canSubmit==0){return false;}
    if(!postData.addressid){core.alert('请选择地址');return false;};
    console.log(that.data.Distributionstatus)
    if(!that.data.Distributionstatus){core.alert('超出配送范围');return false;};

    postData.selectall=true;
    postData.code=that.data.code;
    if(!postData.code){core.alert('请选择支付方式');return false;};
    console.log(postData)
    core.get('ele/AddOrder2',{postData:postData},function(res){
      that.setData({canSubmit:0});
      postData.code=='wxapp' && res.error==0 && core.get('ele/pay',{id:res.order_id,money:totalprice},function(res2){
        console.log(res2);
        if(res2.log_id){
          info.nonceStr=res2.nonceStr;
          info.package=res2.package;
          info.signType=res2.signType;
          info.timeStamp=res2.timeStamp;
          info.paySign=res2.paySign;
        }
        res2.log_id && core.pay(info,function(res3) {
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
      }),that.setData({canSubmit:1});
      //货到付款
      postData.code=='daofu' && res.error==0 && core.get('ele/daofuPay',{userid:app.getCache('userinfo').id,id:res.order_id,money:totalprice},function(res2){
        console.log(res2);
        res2.error==0 && wx.navigateTo({
          url: '/pages/order/payresult?id='+res.order_id,
        })
      }),that.setData({canSubmit:1});
    });
  }
})