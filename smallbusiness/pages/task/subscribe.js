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
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 1,
    staticurl:app.globalData.static,
    task:1,
    page:1,
    showDialogModal:!1,
    latitude:app.getCache('latitude'),
    longitude:app.getCache('longitude'),
    scale:12,
    postData:{},
    contentLength:0,
    minLength:10,
    maxLength:200,
    canInput:1,
    hallTabStatus:1,
    orderList:[],
    highestprice:'',
    minimumprice:''
  },
  /* 生命周期函数 */
  lifetimes: {
    created: function () {
      // 组件实例化，但节点树还未导入，因此这时不能用setData
    },
    attached: function (e) {
      // 在组件实例进入页面节点树时执行 
      // 节点树完成，可以用setData渲染节点，但无法操作节点   
      var TabCur,pageHistory = getCurrentPages();
      TabCur = pageHistory.length<2?1:2;
      this.setData({TabCur:TabCur});
      this.__proto__.getAddressList(this);
    },
    ready: function () {
      // 组件布局完成，这时可以获取节点信息，也可以操作节点
      if(this.data.TabCur==2){
        this.__proto__._getNewMission(this);
      }
    },
    move: function () {
      // 组件实例被移动到树的另一个位置
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
    onReachBottom(){
      console.log(1);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _tabSelect(e) {
      var that=this,id = core.pdata(e).id,userInfo = app.getCache('userInfo');
      userInfo&&app.setCache('userInfo',userInfo,7200);
      if(userInfo.isDelivery==0){
        core.alert('对不起，你不是拎手，不能进去抢单大厅');return false;
      }
      this.setData({
        TabCur: id,
        scrollLeft: (id-1)*60
      })

      var TabCur=that.data.TabCur;
      TabCur==2?(that.setData({orderList:[],page:1}),this.__proto__._getNewMission(that)):'';
    },
    //选择任务类型
    _selectTask(e){
      this.setData({
        task:core.pdata(e).task
      });
    },
    onTextAreaChange(e){
      var content = e.detail.value,data = this.data,maxLength = data.maxLength,minLength = data.minLength,canInput=this.data.canInput;
      
      if(content.length<=maxLength){
        this.setData({
          contentLength:content.length,
        });
        return core.onDataChange(this,e);
      } else{
        var postData=data.postData,message = '内容最多'+maxLength+'个字';
        core.alert(message);
        this.setData({
          postData:postData,
          contentLength:data.contentLength,
          textareaFocus:false
        });
      }
      console.log(this.data.postData);
    },
    // 最高价
    onhighest(e){
      var content = e.detail.value;
      this.setData({
        highestprice:content,
      });
    },
    // 最低价
    onminimum(e){
      var content = e.detail.value;
      this.setData({
        minimumprice:content,
      });
    },
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
    getAddressList(that){
      var postData=that.data.postData;
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
    _hallTabSelect(e){
      let status=core.pdata(e).status;
      this.setData({
        hallTabStatus: status,
      })
      this.setData({orderList:[],page:1}),this.__proto__._getNewMission(this);
    },
    _openLocation: function(item) {
      // console.log(item);
      var that = this;
      wx.openLocation({ //使用微信内置地图查看位置。
          latitude: app.getCache('latitude'), //目标纬度
          longitude: app.getCache('longitude'), //目标经度
          name: 1, //店铺名
          // address: item.address //详细地址
      })
    },
    _getNewMission(that){
      var userInfo = app.getCache('userInfo'),orderList = that.data.orderList;
      core.loading();
      core.get('delivery/getOrder',{userid:userInfo.user_id,deliveryId:userInfo.isDelivery,page:that.data.page,status:that.data.hallTabStatus},function(res){
        res.list != null?orderList=orderList.concat(res.list):that.setData({noData:1});
        res.error==0?(res.list != null&&that.setData({
          orderList:orderList,
          page:res.page+1,
          noData:0
        })):'';
        core.hideLoading();
      });
        console.log(that.data);
    },
    //抢单
    _getOrder(e){
      let that=this,userInfo = app.getCache('userInfo');
      core.post("delivery/applyOrder",{userid:userInfo.user_id,deliveryId:userInfo.isDelivery,orderId:core.pdata(e).id},function(res){
        res.error==0?(core.success(res.message),setTimeout(() => {
          that.setData({page:1,orderList:[]}),that.__proto__._getNewMission(that)
        }, 1e3)
        ):(core.toast(res.message,'none'));
      });
    },
    //开始配送
    _startOrder(e){
      core.alert('你不是拎手，没有权限配送订单');
    },
    //确认送达
    _confirmOrder(e){
      core.alert('你不是拎手，没有权限确认订单');
    },
    //去结算
    _goPay(){
      // core.alert('功能正在调整');
      var that = this,postData = that.data.postData,minimumprice=that.data.minimumprice,highestprice=that.data.highestprice;
      console.log(postData)
      if(!postData.content) return core.alert('商品信息不能为空');
      if(minimumprice=='') return core.alert('商品最低价不能为空');
      if(highestprice=='') return core.alert('商品最高价不能为空');
      if(Number(highestprice)<Number(minimumprice)) return core.alert('商品最高价不能低于最低价');
      if(!postData.addressid) return core.alert('收货地址不能为空');
      core.get("user/publishAppointment",{userid:app.getCache('userinfo').id,content:postData.content,min_price:minimumprice,max_price:highestprice,logistic:6,address_id:postData.addressid},function(res){
        console.log(res)
        core.alert(res.message)
        if(res.message=='预约成功'){
          postData.content=''
          minimumprice=''
          highestprice=''
          that.setData({
            postData:postData,
            minimumprice:minimumprice,
            highestprice:highestprice
          })
        }
      })
    }
  }
})
