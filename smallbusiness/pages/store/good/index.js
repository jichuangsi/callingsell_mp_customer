const app = getApp(),core = app.requirejs("core"),wxParse = app.requirejs("wxParse/wxParse");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNew:1,
    isFullReduce:1,
    fullReduce:[
      {
        price:30,
        reduce:2
      },
      {
        price:50,
        reduce:5
      }
    ],
    goodpicker:0,
    cateindex:0,
    goodindex:0,
    specCur:[],
    curSpecIndex:0,
    cartGoods:[],
    cartGoodsInfo:[],
    curGood:{},
    dishes:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    that.setData({
      id:options.shopid,
      goodid:options.goodid,
      goodindex:options.goodIndex,
      cateindex:options.cateindex
    });
    core.loading();
    core.get("ele/DisheDetail",{id:that.data.goodid,userid:app.getCache('userinfo').id},function(res){
      console.log(res)
      !res.error && that.setData({
        good:res.good,store:res.store,isCollect:res.good.is_collect==1?true:false
      // }),wxParse.wxParse("wxParseData", "html", res.good.details, that, "0");
      }),core.hideLoading();
    });
    
    //获取店铺商品分类
    core.get("ele/Dishes",{id:this.data.id},function(res){
      res.error==0 && that.setData({
        dishes:res.dishes,
      })
    });
    core.get("user/getEleStoreCart",{shopid:that.data.id},function(res){
      res.error==0 && that.setData({
        total_price:res.data.total_price,
        cartGoodsInfo:res.data.goodsInfo
      }); 
      core.hideLoading();
    });

    
    var cartGoods=[], canClear=0, dishesInterval = setInterval(function() {
      console.log(that.data.firstLoad);
      let dishes=that.data.dishes,cartGoodsInfo=that.data.cartGoodsInfo;
      (dishes && cartGoodsInfo) ?canClear=1:'';
      dishes.forEach(function(item,index){
        item.goods.forEach(function(item2,index2){
          // console.log(item2);
          if(item2.is_options==1&&cartGoodsInfo[item2['product_id']]){
            let hasbuy=0;
            for (var i = 0; i < item2.options.length; ++i) {
              let buy_num =cartGoodsInfo[item2['product_id']][item2.options[i].options_id];
              item2.options[i].buy_num=buy_num?buy_num:0;
              if(item2.options[i].buy_num>0){hasbuy=1;}
            }
            if(hasbuy==1&&that.data.firstLoad==1){
              cartGoods = cartGoods.concat(item2)
            }
          } else if(item2.is_options==0&&cartGoodsInfo[item2['product_id']]){
            item2.buy_num=cartGoodsInfo[item2['product_id']].buy_num;
            if(item2.buy_num>0){
              cartGoods = cartGoods.concat(item2);
            }
          }
        });
      }),console.log(cartGoods),that.setData({dishes:dishes,cartGoods:cartGoods}),clearInterval(dishesInterval);
    }, 1e3);that.setData({firstLoad:0});
    core.hideLoading();

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
  _getUserInfo(){
    this.setData({showAuthorizeModal:0});
    var that = this, e = setInterval(function() {
      wx.getSetting({
          success: function(n) {
              var a = n.authSetting["scope.userInfo"];
              // a && (app.globalData.needauth=0, clearInterval(e),app.getUserInfo2());
              a && ( clearInterval(e),app.getUserInfo2());
          }
      });
    }, 1e3);
  },
  //进店逛逛
  goStore(){
    wx.navigateTo({
      url: '/pages/store/index?id='+this.data.id,
    })
  },
  //收藏
  goCollect(){
    let that = this,result='';
    core.get('user/userCollertGood',{goodid:that.data.goodid,shopid:that.data.id,userid:app.getCache('userinfo').id,isCollect:that.data.isCollect?1:0},function(res){
      console.log(res)
      res.error==0 && that.setData({
        isCollect:!that.data.isCollect
      });
      result = res.error==0?'':'fail';
      core.toast(res.message,result);
    });

  },
  //拨打电话
  goPhone(e){
    // console.log(e.currentTarget.dataset['phone']);
    core.phone(e);
  },
  //添加到购物车
  // addCart(){
  //   wx.showToast({
  //     title: '已添加',
  //     icon: 'success',
  //     duration: 2000
  //   })
  // },
  //增加
  addCart(){
    var that = this,data=that.data,dishes=data.dishes,store=data.store,cartGoods=data.cartGoods,specCur=data.specCur,curGood=data.curGood,
    curCateIndex=data.curCateIndex,curGoodIndex=data.curGoodIndex,spec=data.spec,cartGoodsData=[],canAddCart=0;
    //多规格购买
    if(!specCur.buy_num){specCur.buy_num=1;}else{specCur.buy_num+=1;}
    //多规格赋值

    cartGoods.length==0? cartGoods=cartGoods.concat(curGood):'';

    let inArray = 0,cartGoodsIndex;
    cartGoods.forEach(function(item,index){
      cartGoods[index]['product_id']==curGood['product_id']?(inArray=1,cartGoodsIndex=index):'';
    })
    inArray?cartGoods[cartGoodsIndex]=curGood:cartGoods = cartGoods.concat(curGood); //1 存在，直接赋值   0 不存在，加入
    dishes[curCateIndex]['goods'][curGoodIndex]=curGood;

    cartGoods.forEach(function(item,index){
      let options={},t={},t2={};
      if(item.is_options==1){
        item.options.forEach(function(item2,index2){
          if(item2.buy_num>0){  options[item2.options_id]=item2.buy_num; }
          t['options']=options;
        });
        cartGoodsData[index]=t;
      } else{
        t2['num']=item.buy_num;
        cartGoodsData[index]=t2;
      }
      cartGoodsData[index]['product_id']=item.product_id;
    });
    // console.log(cartGoods);
    // console.log(cartGoodsData);return false;
    !canAddCart&&core.get("user/addEleCart",{shopid:store.shop_id,goods:cartGoodsData},function(res){
      res.error==0 && that.setData({ 
        total_price:res.data.total_price,
        dishes:dishes,
        cartGoods:cartGoods,
        curGood:curGood,
      }),that.setData({canAddCart:1}),core.success(res.message);
    });
    // this.setData({
    //   dishes:dishes,
    //   cartGoods:cartGoods,
    //   curGood:curGood,
    // });
  },
  //减少
  reduceCart(){
    var that = this,data=that.data,dishes=data.dishes,store=data.store,cartGoods=data.cartGoods,specCur=data.specCur,curGood=data.curGood,
    curCateIndex=data.curCateIndex,curGoodIndex=data.curGoodIndex,spec=data.spec,cartGoodsData=[],canAddCart=0;
    // console.log(specCur.buy_num);
    if(specCur.buy_num>1){specCur.buy_num-=1;}else{specCur.buy_num=0;}
    // console.log(specCur.buy_num);
    cartGoods.length==0? cartGoods=cartGoods.concat(curGood):'';

    let inArray = 0,cartGoodsIndex;
    cartGoods.forEach(function(item,index){
      cartGoods[index]['product_id']==curGood['product_id']?(inArray=1,cartGoodsIndex=index):'';
    })
    inArray?cartGoods[cartGoodsIndex]=curGood:cartGoods = cartGoods.concat(curGood); //1 存在，直接赋值   0 不存在，加入
    console.log(dishes[curCateIndex])
    dishes[curCateIndex]['goods'][curGoodIndex]=curGood;

    cartGoods.forEach(function(item,index){
      let options={},t={},t2={};
      if(item.is_options==1){
        item.options.forEach(function(item2,index2){
          if(item2.buy_num>0){  options[item2.options_id]=item2.buy_num; }
          t['options']=options;
        });
        cartGoodsData[index]=t;
      } else{
        t2['num']=item.buy_num;
        cartGoodsData[index]=t2;
      }
      cartGoodsData[index]['product_id']=item.product_id;
    });
    console.log(cartGoods);
    !canAddCart&&core.get("user/addEleCart",{shopid:store.shop_id,goods:cartGoodsData},function(res){
      res.error==0 && that.setData({ 
        total_price:res.data.total_price,
        dishes:dishes,
        cartGoods:cartGoods,
        curGood:curGood,
      });
    });
    // !canAddCart&&this.setData({
    //   dishes:dishes,
    //   cartGoods:cartGoods,
    //   curGood:curGood,
    // });
  },
  selectPicker(e){
    console.log(e)
    if(!app.getCache("userinfo")){
      this.setData({showAuthorizeModal:1});
    } else{
      var that=this,type= core.pdata(e).type;
      // that.setData({
      //   goodpicker:1
      // });
      if(type=='buy'){
        this.buyNow();
      } else{
        this.goodSelectSpec();
      }
    }
  },
  buyNow(){
    var that=this;
    console.log(that.data)
    console.log(that.data.good)
    if(that.data.good.price>=that.data.store.since_money){
      wx.navigateTo({
        url: '/pages/order/create?goodid='+that.data.goodid+'&shopid='+that.data.good.shop_id,
      })
    }else{
      core.alert('最低起送价'+that.data.store.since_money)
    }
  },
  _hideModal(){
    app.hideModal(this);
  },
  goodSelectSpec(e){
    var cateindex=this.data.cateindex,goodindex=this.data.goodindex, good = this.data.good,
    data={
      'cateindex':cateindex,'goodindex':goodindex,'good':good
    };
    console.log(good)
    if(good.is_options==1){
      this.showSpecModal(data)
    } else{
      this.addCart2(data);
    }
  },
  //没有规格加入购物车
  addCart2(goodData){
    var that = this,data=that.data,dishes=data.dishes,store=data.store,cartGoods=data.cartGoods,curGood=goodData.good,
    curCateIndex=goodData.cateindex,curGoodIndex=goodData.goodindex,cartGoodsData=[],canAddCart=0;
    for(let i = 0;i<cartGoods.length;i++){
      if(cartGoods[i].product_id==curGood.product_id){
        curGood.buy_num = cartGoods[i].buy_num
      }
    }
    console.log(dishes)
    console.log(curCateIndex)
    //多规格购买
    if(!curGood.buy_num){curGood.buy_num=1;}else{curGood.buy_num+=1;}
    //多规格赋值
    // console.log(curGood)
    // console.log(cartGoods)
    // return;
    cartGoods.length==0? cartGoods=cartGoods.concat(curGood):'';
    let inArray = 0,cartGoodsIndex;
    cartGoods.forEach(function(item,index){
      cartGoods[index]['product_id']==curGood['product_id']?(inArray=1,cartGoodsIndex=index):'';
    })
    inArray?cartGoods[cartGoodsIndex]=curGood:cartGoods = cartGoods.concat(curGood); //1 存在，直接赋值   0 不存在，加入
    dishes[curCateIndex]['goods'][curGoodIndex]=curGood;

    cartGoods.forEach(function(item,index){
      let options={},t={},t2={};
      if(item.is_options==1){
        item.options.forEach(function(item2,index2){
          if(item2.buy_num>0){  options[item2.options_id]=item2.buy_num; }
          t['options']=options;
        });
        cartGoodsData[index]=t;
      } else{
        t2['num']=item.buy_num;
        cartGoodsData[index]=t2;
      }
      cartGoodsData[index]['product_id']=item.product_id;
    });
    // console.log(cartGoodsData);
    // console.log(cartGoods);
    // return false;
    console.log(cartGoodsData)
    !canAddCart&&core.get("user/addEleCart",{shopid:store.shop_id,goods:cartGoodsData},function(res){
      res.error==0 && that.setData({ 
        total_price:res.data.total_price,
        dishes:dishes,
        cartGoods:cartGoods,
        curGood:curGood,
      }),core.success(res.message);
    });
    // !canAddCart&&this.setData({
    //   dishes:dishes,
    //   cartGoods:cartGoods,
    //   curGood:curGood,
    // });
  },
  //显示规格窗口
  showSpecModal(data){
    console.log(data)
    console.log(this.data.dishes)
    console.log(1111)
    let that=this,curSpecIndex=that.data.curSpecIndex,cateindex=data.cateindex,goodindex=data.goodindex,good=data.good,dishes=that.data.dishes;
    if(that.data.goodindex!=goodindex){ curSpecIndex=0; }
    console.log(dishes)
    for(let i = 0;i<dishes.length;i++){
      for(let j = 0;j<dishes[i].goods.length;j++){
        if(dishes[i].goods[j].product_id==good.product_id){
          good.options = dishes[i].goods[j].options
        }
      }
    }
    console.log(that.data.goodindex+'-------'+goodindex)
    that.setData({
      curCateIndex:cateindex,
      curGoodIndex:goodindex,
      curGood:good,
      product_name:good.name,
      spec:good.options,
      specCur:good.options[0],
      curSpecIndex:curSpecIndex,
      showSpecModal:1,
    });
    console.log(that.data.cartGoods)
    console.log(that.data.curGood)
  },
  hideModal(e) {
    this.setData({ showSpecModal:0 })
  },
  selectSpec(e){
    console.log(111)
    console.log(e)
    var that=this,specIndex = core.pdata(e).index;
    that.setData({
      curSpecIndex:specIndex,
      specCur:that.data.spec[specIndex]
    });
  },
})