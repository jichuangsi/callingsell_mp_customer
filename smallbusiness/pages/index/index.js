const app = getApp(),core = app.requirejs('core');
Page({
  data: {
    getLocation:0,
    staticurl:app.globalData.static,
    page:0,
    changeType:0,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    PageCur: 'home',
    swiperList: [{
      id: 0,
      type: 'image',
      url: '../../images/banner-01.png'
    }, {
      id: 1,
      type: 'image',
      url: '../../images/banner-01.png',
    }, {
      id: 2,
      type: 'image',
      url: '../../images/banner-01.png'
    }, {
      id: 3,
      type: 'image',
      url: '../../images/banner-01.png'
    }, {
      id: 4,
      type: 'image',
      url: '../../images/banner-01.png'
    }],
    DotStyle:!0,
    iconList: [{
      icon: 'cardboardfill',//可删
      color: 'red',//可删
      badge: 0,//可删
      name: '超市',
      url: '/pages/store/list?type=83',
    }, {
      icon: 'recordfill',
      color: 'orange',
      badge: 0,
      name: '便利店',
      url: '/pages/store/list?type=96',
    }, {
      icon: 'picfill',
      color: 'yellow',
      badge: 0,
      name: '肉菜市场',
      url: '/pages/store/list?type=3',
    }, {
      icon: 'noticefill',
      color: 'olive',
      badge: 0,
      name: '新鲜水果',
      url: '/pages/store/list?type=4',
    }, {
      icon: 'upstagefill',
      color: 'cyan',
      badge: 0,
      name: '餐饮',
      url: '/pages/store/list?type=85',
    }, {
      icon: 'upstagefill',
      color: 'cyan',
      badge: 0,
      name: '农贸自售',
      url: '/pages/store/list?type=115',
    }, 
    // {
    //   icon: 'clothesfill',
    //   color: 'blue',
    //   badge: 0,
    //   name: '我的会员'
    // },
     {
      icon: 'discoverfill',
      color: 'purple',
      badge: 0,
      name: '流动摊位',
      url: '/pages/member/joinus/stall'
    }, {
      icon: 'questionfill',
      color: 'mauve',
      badge: 0,
      name: '固定店铺',
      url: '/pages/member/joinus/store'
    }, {
      icon: 'commandfill',
      color: 'purple',
      badge: 0,
      name: '拎手招募',
      url: '/pages/member/delivery/join'
    },{
      icon: 'upstagefill',
      color: 'cyan',
      badge: 0,
      name: '其他服务',
      url: '/pages/store/list?type=116',
    }
    // , {
    //   icon: 'brandfill',
    //   color: 'mauve',
    //   badge: 0,
    //   name: '其他服务'
    // }
  ],
    navCol:5,
    navBorder:!1,
    storeList:[],
    locationInfo:{},
  },
  onLoad: function (options) {
    //根据PageCur的值显示不同的tabbar页面
    const PageCur = options.PageCur,TabCur = options.TabCur;
    if(PageCur){
      this.setData({
        PageCur:PageCur
      });
    }
    if(TabCur){
      this.setData({
        TabCur:TabCur
      });
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    //获取外卖商家
    app.check_getSetting(this);
    that.getLocation(); 
  },
  onShow: function(){
    var that=this,PageCur=that.data.PageCur,locationInfo=app.getCache('locationInfo');
    // if(!app.getCache("latitude") && !app.getCache("longitude")){
    //   that.getLocation(); 
    //   that.getStoreList(); 
    // }
    if(PageCur=='home'){
      this.getStoreList();
      this.getNotice();
    }
    // that.getLocation();
    // locationInfo&&that.setData({
    //   address:locationInfo.address
    // });
    that.setData({
      storeList:[],
      locationInfo:locationInfo.address?locationInfo:{
        address:'',
        lat:'',
        lng:''
      }
    });
    // this.getStoreList();
    // this.getNotice();
    // that.getLocation(); 
  },
  /**
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log(222)
    // this.getLocation();
    app.getLocation(this);
  },
  /**
  * 调用wx.getLocation系统API,获取并设置当前位置经纬度
  */
  getLocation: function() {
    var that = this,address="";
    //获取位置
    wx.getLocation({
        type: 'gcj02', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
        // isHighAccuracy: true,  高精准度
        highAccuracyExpireTime:3000,
        success: function(res) {
          res.errMsg=="getLocation:ok" && app.setCache("latitude",res.latitude,86400),app.setCache("longitude",res.longitude,86400),app.setCache("latitude2",res.latitude,86400),app.setCache("longitude2",res.longitude,86400),wx.request({          
            url: "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude + "&key="+app.getCache('config').map_key+'&get_poi=1',
            success: function (result) {
              console.log(787878)
              console.log(result)
              let data = result.data,locationInfo=that.data.locationInfo;
              // console.log(result);
              data.result.poi_count?address=data.result.pois[0].title:data.result.address;

              // result.statusCode==200 && result.errMsg=="request:ok" && that.setData({
              //   address:address
              // }),app.setCache('locationInfo',address);
              (result.statusCode==200 && result.errMsg=="request:ok")? (
                locationInfo.address = address,
                locationInfo.lat = res.latitude,
                locationInfo.lng = res.longitude,
                that.setData({
                  locationInfo:locationInfo
              }),app.setCache('locationInfo',locationInfo),
              app.setCache("addr", data.result.address_component.street_number)
              // ,that.getStoreList()
              ):core.confirm('定位失败');
            }
          }); 
          that.setData({
            postion: true,
            lng: res.longitude,
            lat: res.latitude,
          })
        },
        fail: function(e) {}
    });
  },
  //tabbar切换
  tabbarChange:function(e){
    let type = e.currentTarget.dataset.cur,TabCur=this.data.TabCur,PageCur=e.currentTarget.dataset.cur;
    (type=='task'||type=='subscribe')?TabCur=1:'';
    this.setData({
      PageCur: PageCur,
      TabCur:TabCur,
    })
    if(PageCur=='home'){
      this.setData({storeList:[]});
      this.getStoreList();
    }
  },
  getStoreList(){
    var that = this,page=that.data.page;
    page<1?page=1:page+=1;
    core.get("ele/StoreList",{page:page},function(res){
      console.log(res)
      res.error==0 && that.setData({
        storeList:that.data.storeList.concat(res.list)
      });
    });
  },
  goSearch(){
    wx.navigateTo({
      url: '/pages/index/search',
    })
  },
  //获取平台文章
  getNotice(){
    var that = this;
    core.get("ele/getNotice",{},function(res){
      res.error==0&&that.setData({notice:res.list});
    });
  },
  goUrl(e){
    console.log(21111)
    console.log(e)
    core.goUrl(e);
  },
  ttt(e){
    core.pdata(e).type=='clothesfill'?core.alert('当前免费使用'):core.alert('功能正在调整');
  }
})
