const app = getApp(), core = app.requirejs("core"),wxParse = app.requirejs("wxParse/wxParse");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total_price:0,
    isLike:1,
    NavCur:1,
    TabCur:0,
    PageCur:"store",
    DotStyle:!0,
    specModal:0,
    curSpecIndex:0,
    specCur:[],
    curGood:{},
    cartGoods:[],
    commentList:[],
    dishes:[],
    cartGoodsInfo:[],
    canAddCart:1,
    page:1,
    firstLoad:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.id){
      this.setData({id:options.id});
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true
    // });
    core.loading();
    //获取商店详情
    core.get("ele/Store",{id:this.data.id,userid:app.getCache('userinfo').id},function(res){
      !res.error && that.setData({
        store:res.detail,
        commentCount:res.detail.commentCount,
        pl:res.pl,
        isFollow:res.detail.is_follow
      });
    });
    //获取店铺商品分类
    core.get("ele/Dishes",{id:this.data.id},function(res){
      res.error==0 && that.setData({
        dishes:res.dishes,
      }),that.getEleStoreCart();
    });
    // wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { 
    var that = this;
    //获取用户对应商铺购物车详情
    this.getEleStoreCart();
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
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  /*关注*/
  storeFollow(){
    var that = this,result='';
    core.get("user/userFollowStore",{shopid:that.data.id,userid:app.getCache('userinfo').id,isFollow:that.data.isFollow},function(res){
      res.error==0&&that.setData({
        isFollow:res.isFollow
      });
      result = res.error==0?'':'none';
      core.toast(res.message,result);
      console.log(result);
    });
  },
  navSelect(e) {
    var that=this,navIndex = core.pdata(e).id;
    this.setData({
      NavCur: navIndex,
      commentList:[]
    })
    //
    that.data.store.star!=0&&navIndex==2&&this.getComment();
  },
  getEleStoreCart(){
    let that=this;
    core.get("user/getEleStoreCart",{shopid:this.data.id},function(res){
      res.error==0 && that.setData({
        total_price:res.data.total_price,
        cartGoodsInfo:res.data.goodsInfo
      }); 
      core.hideLoading();
    });
  },
  getComment(){
    var that=this;
    that.data.NavCur==2&&core.get("ele/StorePl",{id:that.data.id,page:that.data.page},function(res){
      res.list = that.data.commentList.concat(res.list);
      res.error==0&&that.setData({
        commentList:res.list,
      });
    });
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.tabid,
      MainCur: e.currentTarget.dataset.tabid,
      VerticalNavTop: (e.currentTarget.dataset.tabid - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;     
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },
  getCateGoods(shopid,cateid){
    //获取分类里面的商品
    // core.get("wxapp/getCategoryGoods",{shop_id:shopid,cate_id:cateid},function(res){
    //   console.log(res);
    // });
  },
  /*选择规格*/
  goodSelectSpec(e){
    console.log(e)
    var cateindex=core.pdata(e).cateindex,goodindex=core.pdata(e).goodindex, good = core.pdata(e).good,
    data={
      'cateindex':cateindex,'goodindex':goodindex,'good':good
    };
    if(good.is_options==1){
      this.showSpecModal(data)
    } else{
      this.addCart2(data);
    }
  },
  //显示规格窗口
  showSpecModal(data){
    let that=this,curSpecIndex=that.data.curSpecIndex,cateindex=data.cateindex,goodindex=data.goodindex,good=data.good;
    if(that.data.goodindex!=goodindex){ curSpecIndex=0; }
    
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
    console.log(that.data.curGood)
  },
  hideModal(e) {
    this.setData({ showSpecModal:0 })
  },
  selectSpec(e){
    var that=this,specIndex = core.pdata(e).index;
    that.setData({
      curSpecIndex:specIndex,
      specCur:that.data.spec[specIndex]
    });
  },
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
  //没有规格加入购物车
  addCart2(goodData){
    var that = this,data=that.data,dishes=data.dishes,store=data.store,cartGoods=data.cartGoods,curGood=goodData.good,
    curCateIndex=goodData.cateindex,curGoodIndex=goodData.goodindex,cartGoodsData=[],canAddCart=0;
    //多规格购买
    if(!curGood.buy_num){curGood.buy_num=1;}else{curGood.buy_num+=1;}
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
    // console.log(cartGoodsData);
    // console.log(cartGoods);
    // return false;
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
  //没有规格的减少
  reduceCart2(e){
    var that = this,data=that.data,dishes=data.dishes,store=data.store,cartGoods=data.cartGoods,
    goodData=core.pdata(e),curGood=goodData.good,curCateIndex=goodData.cateindex,curGoodIndex=goodData.goodindex,cartGoodsData=[],canAddCart=0;
    // console.log(goodData);
    if(curGood.buy_num>1){curGood.buy_num-=1;}else{curGood.buy_num=0;}
    console.log(curGood);
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
    console.log(cartGoods);
    core.get("user/addEleCart",{shopid:store.shop_id,goods:cartGoodsData},function(res){
      res.error==0 && that.setData({
        total_price:res.data.total_price,
        dishes:dishes,
        cartGoods:cartGoods,
        curGood:curGood,
      });
    }),that.setData({canAddCart:1});;
    // this.setData({
    //   dishes:dishes,
    //   cartGoods:cartGoods,
    //   curGood:curGood,
    // });
  },
  //结算
  goPay(){
    var that=this,shopid=that.data.store.shop_id;
    if(!app.getCache("userinfo")){
      this.setData({showAuthorizeModal:1});
    }
    console.log(that.data.total_price)
    console.log(that.data.store)
    that.data.total_price?that.data.total_price>=that.data.store.since_money?wx.navigateTo({
      url: '/pages/order/create?shopid='+shopid+'&userid='+app.getCache('userinfo')['id']+'&type=cart',
    }):core.alert('最低起送价'+that.data.store.since_money):core.alert('请选择商品');
  },
  goGoodDeatil(e){
    let url = e.currentTarget.dataset['url'];
    wx.navigateTo({
      url: url,
    })
  },
  /*阅读全部*/
  readAll(e){
    var that = this,commentList = that.data.commentList,data = core.pdata(e), id = data.id, showall = data.showall;
    commentList.forEach(function(item,index){
      if(id==item.dianping_id){
        commentList[index].showAll=!showall;
        that.setData({
          commentList:commentList
        });
      }
    });
  },
  /*点击查看图片*/
  preview(t) {
    wx.previewImage({
      current: core.pdata(t).src,
      urls: core.pdata(t).urls
    });
  },
  /*赞*/
  isLike(e){
    var that = this,commentList = that.data.commentList,data = core.pdata(e), id = data.id;
    commentList.forEach(function(item,index){
      if(id==item.id){
        commentList[index].isLike=1;
        commentList[index].like++;
        that.setData({
          commentList:commentList
        });
      }
    });
  },
  /*踩*/
  isUnLike(e){
    var that = this,commentList = that.data.commentList,data = core.pdata(e), id = data.id;
    commentList.forEach(function(item,index){
      if(id==item.id){
        commentList[index].isUnLike=1;
        commentList[index].unLike++;
        that.setData({
          commentList:commentList
        });
      }
    });
  },
  /*拨打电话*/
  goPhone(e){
    // console.log(e.currentTarget.dataset['phone']);
    core.phone(e);
  },
  /* 商店内搜索页 */
  goStoreSearch(){
    var id = this.data.id;
    wx.navigateTo({
      url: '/pages/index/search?id='+id,
    })
  },
  canAddCart(){
    return !this.data.canAddCart;
  }
})