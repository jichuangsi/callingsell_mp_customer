var core = require("utils/core.js");
App({
  onLaunch: function() {
    var t = this;
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
         	this.globalData.Custom = capsule;
        	this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        	this.globalData.pageView = e.screenHeight - this.globalData.CustomBar;
        } else {
        	this.globalData.CustomBar = e.statusBarHeight + 50;
        }
        wx.setStorageSync("systemInfo", e);
      }
    })
    var t = this;
    this.getUserInfo2();
  },
  getConfig: function() {
    if (null !== this.globalData.api) return {
        api: this.globalData.api,
        approot: this.globalData.approot,
        appid: this.globalData.appid
    };
    var e = wx.getExtConfigSync();
    return console.log(e), this.globalData.api = e.config.api, this.globalData.approot = e.config.approot, 
    this.globalData.appid = e.config.appid, e.config;
  },
  getCache: function(e, t) {
    var n = +new Date() / 1e3, o = "";
    n = parseInt(n);
    try {
        (o = wx.getStorageSync(e + this.globalData.appid)).expire > n || 0 == o.expire ? o = o.value : (o = "", 
        this.removeCache(e));
    } catch (e) {
        o = void 0 === t ? "" : t;
    }
    return o = o || "";
  },
  setCache: function(e, t, n) {
    var o = +new Date() / 1e3, i = !0, a = {
        expire: n ? o + parseInt(n) : 0,
        value: t
    };
    try {
        wx.setStorageSync(e + this.globalData.appid, a);
    } catch (e) {
        i = !1;
    }
    return i;
  },
  removeCache: function(e) {
    var t = !0;
    try {
        wx.removeStorageSync(e + this.globalData.appid);
    } catch (e) {
        t = !1;
    }
    return t;
  },
  getUserInfo: function(t, n) {
    var o = this, i = {};
    !(i = o.getCache("userinfo")) || i.needauth ? wx.login({
        success: function(a) {
            a.code ? e.post("wxapp/openid", {
                code: a.code
            }, function(a) {
                a.error ? e.alert("获取用户登录态失败:" + a.message) : a.isclose && n && "function" == typeof n ? n(a.closetext, !0) : wx.getUserInfo({
                  success: function(n) {
                    console.log(n);
                      i = n.userInfo, e.get("wxapp/Jiemi", {
                          data: n.encryptedData,
                          iv: n.iv,
                          sessionKey: a.session_key
                      }, function(e) {
                        console.log(999)
                        console.log(e)
                          1 == e.isblack && wx.showModal({
                              title: "无法访问",
                              content: "您在商城的黑名单中，无权访问！",
                              success: function(e) {
                                  e.confirm && o.close(), e.cancel && o.close();
                              }
                          }), n.userInfo.openid = e.openId, n.userInfo.id = e.id, n.userInfo.uniacid = e.uniacid, 
                          n.needauth = 0, o.setCache("userinfo", n.userInfo, 7200), o.setCache("userinfo_openid", n.userInfo.openid), 
                          o.setCache("userinfo_id", e.id), o.getSet(), t && "function" == typeof t && t(i);
                      });
                  },
                  fail: function() {
                      console.log(a), e.get("wxapp/check", {
                          openid: a.openid
                      }, function(e) {
                        console.log(666)
                        console.log(e)
                          console.log(e), 1 == e.isblack && wx.showModal({
                              title: "无法访问",
                              content: "您在商城的黑名单中，无权访问！",
                              success: function(e) {
                                  e.confirm && o.close(), e.cancel && o.close();
                              }
                          }), e.needauth = 1, o.setCache("userInfo", e, 7200), o.setCache("userinfo_openid", a.openid), 
                          o.setCache("userinfo_id", a.id), o.getSet(), t && "function" == typeof t && t(i);
                      });
                  }
                });
            }) : e.alert("获取用户登录态失败:" + a.errMsg);
        },
        fail: function() {
            e.alert("获取用户信息失败!");
        }
    }) : t && "function" == typeof t && t(i);
  },
  getUserInfo2: function(t,n){
    // console.log("getUserInfo2");
    var that = this,userinfo={};
    !(userinfo = that.getCache("userinfo")) || userinfo.needauth? wx.login({
      success: function(a){
        //这里的code相关，获取openid用
        a.code ? core.post("wxapp/openid", {code:a.code},function(a){
          a.error ? '':that.setCache("config",a.config);
          a.error ? core.alert("获取用户登录态失败:" + a.message) : wx.getUserInfo({
            success:function(res){
              //这里的res是用户信息
              userinfo = res.userInfo, core.get("wxapp/auth", {
                data: res.encryptedData,
                iv: res.iv,
                sessionKey: a.session_key
              }, function(res2) {
                console.log(9999)
                console.log(res2)
                  //这里的res是解密后的数据返回
                    1 == res.is_lock && wx.showModal({
                        title: "无法访问",
                        content: "您在商城的黑名单中，无权访问！",
                        success: function(res) {
                            res.confirm && that.close(), res.cancel && that.close();
                        }
                    }), res.userInfo.openid = res2.openId, res.userInfo.id = res2.id, 
                    res.userInfo.needauth = 0,that.setCache("userinfo", res.userInfo, 7200) ,console.log(res.userInfo), 
                    that.globalData.userInfo = res.userInfo,// 重新赋值
                    that.setCache("userinfo_openid", res.userInfo.openid), 
                    that.setCache("userid", res2.id), 
                    that.setCache("userinfo_id", res2.id), that.getSet(), t && "function" == typeof t && t(userinfo);
              });
            },
            fail:function(){
              console.log(444)
              console.log(res)
              //这里，到时候用户还没有授权都能获取数据库里面对应的数据
              core.post("wxapp/check", { openid: a.openid},function(res){
                1 == res.is_lock && wx.showModal({
                  title: "无法访问",
                  content: "您在商城的黑名单中，无权访问！",
                  success: function(e) {
                      e.confirm && that.close(), e.cancel && that.close();
                  }
                });res.needauth = 1,that.setCache("userinfo", res.userInfo, 7200),console.log(res);
                that.globalData.userInfo = res.member,// 重新赋值
                that.setCache("userinfo_openid", res.member.openid), 
                console.log(res.member),
                that.setCache("userid", res.member.user_id), 
                that.setCache("userinfo_id", a.id), that.getSet(), t && "function" == typeof t && t(userinfo);
              })
            }
          });
        }) : core.alert("获取用户登录态失败:" + a.errMsg);
      }
    }):'';
  },
  close: function() {
    this.globalDataClose.flag = !0, wx.reLaunch({
        url: "/pages/index/index"
    });
  },
  //引入js
  requirejs: function(e) {
    return require("utils/" + e + ".js");
  },
  close: function() {
    this.globalDataClose.flag = !0, wx.reLaunch({
        url: "/pages/index/index"
    });
  },
  getSet: function() {
      var t = this;
      "" == t.getCache("cacheset") && setTimeout(function() {
          var n = t.getCache("cacheset");
      }, 10);
  },
  hideModal(that){
    return that.setData({
      showAuthorizeModal:0
    });
  },
  /**
  * 获取用户当前设置
  */
  check_getSetting: function(that) {
    wx.getSetting({
        success: (res) => {
            if (res.authSetting['scope.userInfo'] != undefined && res.authSetting['scope.userInfo'] == true) {
              //授权
                that.setData({ getUserInfo: true })
            } else {
                //未授权
                that.setData({ getUserInfo: false })
            }
            if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] == true) {
              //授权
                that.setData({ postion: true })
            } else {
                //未授权
                that.setData({ postion: false })
            }
        },
        fail(res) { console.log(res);}
    })
  },
  getLocation: function(that) {
    
    var t = this,address="";
    //获取位置
    wx.getLocation({
        type: 'gcj02', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
        isHighAccuracy: true,
        highAccuracyExpireTime:3000,
        success: function(res) {
          res.errMsg=="getLocation:ok" && t.setCache("latitude",res.latitude,86400),t.setCache("longitude",res.longitude,86400),wx.request({          
            url: "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude + "&key="+t.getCache('config').map_key+'&get_poi=1',
            success: function (result) {
              let data = result.data;
              data.result.poi_count?address=data.result.pois[0].title:data.result.address;
              result.statusCode==200 && result.errMsg=="request:ok" && that.setData({
                address:address
              }),t.setCache('locationAddress',address);
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
  globalData: {
    appid:"wxc9a5c2cfa1172bef",
    // api: "http://192.168.31.84:80/wxapp/", // 线下
    // api: "http://192.168.31.93:81/wxapp/", // 线下
    // api: "http://192.168.31.114:63/wxapp/", // 线下
    // api: "http://www.smallbusiness.com/app/", // 线下
    // api: "http://192.168.1.3:83/wxapp/", // 线下
    api: "https://www.callingsell.com/wxapp/",  //线上
    userInfo: null,
    static:"http://www.callingsell.com/static/yonghuduan/"
  }
})