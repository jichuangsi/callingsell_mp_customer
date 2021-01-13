const { post } = require("../../utils/core");

const app = getApp(),core = app.requirejs('core');
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    staticurl:app.globalData.static,
    cartList:[],
    cartList2:[
      {
        id:1,
        shopname:"麦当劳麦乐送（广州天河店）",
        goods:[{
          id:1,
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
          id:2,
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
      }
    ],
    storeList:[],
    selectList:[],
    good:[]
  },
  /* 生命周期函数 */
  lifetimes: {
    created: function () {
      // 组件实例化，但节点树还未导入，因此这时不能用setData
      console.log('created');
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行 
      // 节点树完成，可以用setData渲染节点，但无法操作节点   
      core.loading();
      console.log('attached');
      // var that = this,cartList=that.data.cartList,storeList=that.data.storeList,cartViewShow;
    },
    ready: function () {
      var that = this,cartList=that.data.cartList,storeList=that.data.storeList,cartViewShow;
      // 组件布局完成，这时可以获取节点信息，也可以操作节点
      core.get("user/getUserEleCart",{},function(res){
        res.cart ? cartList = cartList.concat(res.cart):'';
        cartViewShow = res.cart!=null? 1:0;
        console.log(res.cart);
        // console.log(typeof(res.cart));
        res.error==0 && that.setData({
          cartList:res.cart,
          cartViewShow:cartViewShow,
        });
      });
      core.get("user/getRandStore",{},function(res){
        storeList = storeList.concat(res.randStore);
        res.error==0 && that.setData({
          storeList:storeList
        });
      });
      core.hideLoading();
      console.log(that.data);
    },
    move: function () {
      // 组件实例被移动到树的另一个位置
      console.log('move');
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      console.log('detached');
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _selectStore(e){
      var that=this,cartList=that.data.cartList,itemdata=core.pdata(e),cartindex=itemdata.cartindex,cartid=itemdata.cartid;
      let store = cartList[cartindex];
      if(store['selected']){
        store['selected']=false;
        store['goodlist'].forEach(function(item,index){
          item.selected=false;
        });
      } else{
        store['selected']=true;
        store['goodlist'].forEach(function(item,index){
          item.selected=true;
        });
      }
      this.setData({cartList:cartList});
      that.__proto__._calculateTotalPrice(that,cartindex);
    },
    _selectGood(e){
      var that=this,cartList=that.data.cartList,itemdata=core.pdata(e),cartindex=itemdata.cartindex,goodindex=itemdata.goodindex,goodid=itemdata.goodid;
      let good = cartList[cartindex]['goodlist'][goodindex];
      if(good['selected']){
        good['selected']=false;
        cartList[cartindex]['selected']=false;
      } else{
        good['selected']=true;
        let isSelectAll = !0;
        cartList[cartindex]['goodlist'].forEach(function(item,index){
          if(!item.selected){ isSelectAll=!1;return; }
        });
        isSelectAll?cartList[cartindex]['selected']=!0:'';
      }
      that.setData({
        cartList:cartList
      });
      that.__proto__._calculateTotalPrice(that,cartindex);
    },
    _calculateTotalPrice(that,cartindex){
      var cartList=that.data.cartList,selectcart = cartList[cartindex],totalPrice=0;
      selectcart['goodlist'].forEach(function(item,index){
        item.selected?totalPrice+=item.total_price:'';
      });
      cartList[cartindex]['totalPrice']=totalPrice;
      that.setData({
        cartList:cartList
      });
    },
    _delete(e){
      
      var that=this,cartList = that.data.cartList,cartindex=core.pdata(e).cartindex,shopid=core.pdata(e).shopid,cartid=core.pdata(e).cartid,postData=[],cartViewShow;
      
      cartList.splice(cartindex,1);
      core.confirm("删除不可恢复！确认是否要删除",function(){
        core.get("user/delEleStoreCart",{shopid:shopid,cartid:cartid},function(res){
          cartViewShow = res.cart.length>0? 1:0;
          res.error==0 && that.setData({
            cartList:cartList,
            cartViewShow:cartViewShow
          });
          core.success(res.message);
          console.log(this.data);
          // setTimeout(function() {
          //   wx.reLaunch({
          //     url: '/pages/index/index?PageCur=cart',
          //   });
          // },1300);
        });
      });
      
    },
    _goPay(e){
      var that=this,cartList = that.data.cartList,cartindex=core.pdata(e).cartindex,shopid=cartList[cartindex]['shop_id'],
      selectall=cartList[cartindex]['selected'],ids=[],good=[],i=0;
      cartList[cartindex]['goodlist'].forEach(function(item,index){
        // var data = {};
        if(item.selected){
          var data = {};
          // item.selected?postData=postData.concat(item):'';
          // ids[index]=item.product_id;
          // nums[index]=item.num;
          data.id=item.product_id;
          data.num=item.num;
          data.option_id=item.option_id;
          data.option_name=item.option_name;
          // data={id:item.product_id,num:item.num}
          // i==0?good[index]=data:good=good.concat(data);
          i==0?good[i]=data:good[i]=data;
          i++;
        }

      });
      // core.get("ele/createOrder",{
      //   // ids:ids,
      //   // nums:nums,
      //   type:'cart',
      //   goods:good,
      //   shopid:shopid,
      //   selectall:selectall
      // },function(res){

      // })
      good.length?wx.navigateTo({
        url: '/pages/order/create?shopid='+shopid+'&userid='+app.getCache('userinfo')['id']+'&type=cart&selectall='+selectall+'&goods='+JSON.stringify(good),
      }):core.alert('请选择商品');
      console.log(that.data);
    }
  }
})
