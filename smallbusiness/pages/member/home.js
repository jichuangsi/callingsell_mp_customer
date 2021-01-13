const app = getApp(),core = app.requirejs('core');
Component({
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
    showAuthorizeModal:0,
    serverList:[
    //   {
    //   icon: 'member/server-01.png',
    //   name: '我的会员',
    //   url:''
    // },
    {
      icon: 'member/server-02.png',
      name: '商家入驻',
      url:'/pages/member/joinus/index'
    },
    {
      icon: 'member/server-03.png',
      name: '拎手招募',
      url:'/pages/member/delivery/join'
    },
    // {
    //   icon: 'member/server-04.png',
    //   name: '消费统计',
    //   url:'/pages/member/server/statistics'
    // },
    // {
    //   icon: 'member/server-05.png',
    //   name: '附近商家',
    //   url:'/pages/member/server/nearby'
    // },
    {
      icon: 'member/server-06.png',
      name: '我的预约',
      url:'/pages/member/appointment/list'
    }],
    otherList:[{
      icon: 'member/other-01.png',
      name: '我的地址',
      url:'/pages/member/address/index'
    },
    {
      icon: 'member/other-02.png',
      name: '联系客服',
      url:'/pages/store/contact'
    },
    {
      icon: 'member/other-03.png',
      name: '我的协议',
      url:'/pages/member/setting'
    },
    {
      icon: 'member/other-04.png',
      name: '意见反馈',
      url:'/pages/store/feedback'
    }],
    Unread:0
  },
  /* 生命周期函数 */
  lifetimes: {
    created: function () {
      // 组件实例化，但节点树还未导入，因此这时不能用setData
      core.loading();
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行 
      // 节点树完成，可以用setData渲染节点，但无法操作节点   
      var that=this,userinfo = app.getCache("userinfo"),serverList=that.data.serverList;
      // var that=this,userinfo = app.globalData.userinfo;
      wx.getSetting({
        success: function(n) {
            var a = n.authSetting["scope.userInfo"]; 
            !a && that.data.userinfo==null && that.setData({  //that.data.getUserInfo
              showAuthorizeModal: 1
            });
            console.log(9999)
            console.log(n)
            console.log(userinfo)
            a && core.get("wxapp/check", { openid:userinfo.openid },function(res){
              console.log(res)
              res.error ? core.alert("获取用户登录态失败:" + res.message):(
                serverList.forEach(function(item,index){
                  item.name=='拎手招募'&&serverList.splice(index,1);
                }),
                serverList = serverList.concat(
                  // [{ icon: 'member/server-07.png',  name: '抢单大厅', url:'/pages/index/index?PageCur=task&&TabCur=2' },{ icon: 'member/server-08.png', name: '拎手榜', url:'' }]
                  [{ icon: 'member/server-07.png',  name: '抢单大厅', url:'/pages/index/index?PageCur=task&&TabCur=2' }]
                ),
                res.member.isStore!=0?serverList[0].name='我的店铺':0,
                app.setCache("userInfo", res.member, 7200),that.setData({userInfo:res.member,serverList:serverList}),
                
                //获取抢单大厅
                core.get("Delivery/isNewOrder",{userid:userinfo.user_id,deliveryId:res.member.isDelivery},function(res){
                  console.log(res)
                  !res.error ? that.setData({
                    hallcount:res.count
                  }):'';
                })
              )
            });
        }
      });
      //有缓存就直接获取用户信息
      // userinfo=="" && core.get("wxapp/check", { openid:userinfo.openid },function(res){
      //   console.log(res);
      //   res.error ? core.alert("获取用户登录态失败:" + res.message):(app.setCache("userinfo", res.member, 7200),that.setData({userinfo:res.member}));
      // });
      //获取订单数量
      core.get("user/getMyOrderCount",{},function(res){
        !res.error ? that.setData({
          ordercount:res.orderCount
        }):'';
      });
      //获取点赞、评论、收藏数
      core.get("user/getMyCollectCount",{},function(res){
        !res.error ? that.setData({
          collect:res.collect,
          comment:res.comment,
          follow:res.follow,
        }):core.alert(res.message);
      });
      //获取未读
      core.get("ele/getUnreadMsg",{},function(res){
        console.log(res)
        that.setData({
          Unread:res.data
        })
      });
    },
    ready: function () {
      // 组件布局完成，这时可以获取节点信息，也可以操作节点
      core.hideLoading();
    },
    move: function () {
      // 组件实例被移动到树的另一个位置
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
        let that = this
      //获取未读
      core.get("ele/getUnreadMsg",{},function(res){
        console.log(res)
        that.setData({
          Unread:res.data
        })
      });
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _getSetting(){
      
    },
    _hideModal(){
      this.setData({
        showAuthorizeModal:0
      });
    },

    _getUserInfo(e){
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo;
      // var n = e.detail, that = this
      // wx.login({
      //   success: function(a) {
      //     console.log(a)
      //     core.post("wxapp/openid", {
      //       code: a.code
      //       }, function(a) {
      //         console.log(a)
      //         core.get("wxapp/Jiemi", {
      //           data: n.encryptedData,
      //           iv: n.iv,
      //           sessionKey: a.session_key
      //         }, function(e) {
      //           console.log(e)
      //           n.userInfo.openid = e.openId
      //           console.log(n.userInfo)
      //           app.setCache("userinfo", n.userInfo, 7200)
                
      //           that.setData({showAuthorizeModal:0});
      //           var e = setInterval(function() {
      //             wx.getSetting({
      //                 success: function(n) {
      //                     var a = n.authSetting["scope.userInfo"];
      //                     a && (app.globalData.userInfo.needauth=0, clearInterval(e),app.getUserInfo2(),wx.reLaunch({
      //                         url: "/pages/index/index?PageCur=member"
      //                     }));
      //                 }
      //             });
      //           }, 1e3);
      //       })
      //     })
      //   }
      // })
      this.setData({showAuthorizeModal:0});
      var that = this, e = setInterval(function() {
        wx.getSetting({
            success: function(n) {
                var a = n.authSetting["scope.userInfo"];
                a && (app.globalData.userInfo.needauth=0, clearInterval(e),app.getUserInfo2(),wx.reLaunch({
                    url: "/pages/index/index?PageCur=member"
                }));
            }
        });
      }, 1e3);
    },
    //点赞、评论、收藏
    _goCollect(e){
      wx.navigateTo({
        url: core.pdata(e).url,
      })
    },
  },
})
