var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, e = require("jquery");

module.exports = {
    toQueryPair: function(t, e) {
        return void 0 === e ? t : t + "=" + encodeURIComponent(null === e ? "" : String(e));
    },
    getUrl: function(n, o, i) {
        // n = n.replace(/\//gi, ".");
        // var a = getApp().getConfig().api + "&r=" + n;
        var a = getApp().getConfig().api + n + "?";
        return o && ("object" == (void 0 === o ? "undefined" : t(o)) ? a += "&" + e.param(o) : "string" == typeof o && (a += "&" + o)), 
        a;
    },
    json: function(t, n, o, i, a, s) {
        var r = getApp(), c = r.getCache("userinfo_openid")?r.getCache("userinfo_openid"):c, u = r.getCache("usermid"), f = r.getCache("authkey"),userinfo = r.getCache('userinfo');
        (n = n || {}).comefrom = "wxapp", n.openid = n.openid ? n.openid:c,n.session_key = n.session_key ? n.session_key:c,n.userid = userinfo.id?userinfo.id:userinfo.user_id?userinfo.user_id:n.userid,n.lat=r.getCache('latitude')?r.getCache('latitude'):n.lat,n.lng=r.getCache('longitude')?r.getCache('longitude'):n.lng, u && (n.mid = u.mid, 
        n.merchid = n.merchid || u.merchid);
        var d = this;
        i && d.loading(), n && (n.authkey = f || "");
        var l = {
            url: (a ? this.getUrl(t) : this.getUrl(t, n)) + "&timestamp=" + +new Date(),
            method: a ? "POST" : "GET",
            header: {
                "Content-type": a ? "application/x-www-form-urlencoded" : "application/json",
                Cookie: "PHPSESSID=" + c
            }
        };
        s || delete l.header.Cookie, a && (l.data = e.param(n)), o && (l.success = function(t) {
            if (i && d.hideLoading(), "request:ok" == t.errMsg && "function" == typeof o) {
                if (r.setCache("authkey", t.data.authkey || ""), void 0 !== t.data.sysset) {
                    if (1 == t.data.sysset.isclose) return void wx.redirectTo({
                        url: "/pages/message/auth/index?close=1&text=" + t.data.sysset.closetext
                    });
                    r.setCache("sysset", t.data.sysset);
                }
                o(t.data);
            }
        }), l.fail = function(t) {
            i && d.hideLoading(), d.alert(t.errMsg);
        }, wx.request(l);
    },
    post: function(t, e, n, o, i) {
        this.json(t, e, n, o, !0, i);
    },
    get: function(t, e, n, o, i) {
        this.json(t, e, n, o, !1, i);
    },
    getDistanceByLnglat: function(t, e, n, o) {
        function i(t) {
            return t * Math.PI / 180;
        }
        var a = i(e), s = i(o), r = a - s, c = i(t) - i(n), u = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(r / 2), 2) + Math.cos(a) * Math.cos(s) * Math.pow(Math.sin(c / 2), 2)));
        return u *= 6378137, u = Math.round(1e4 * u) / 1e7;
    },
    alert: function(e, n) {
        "object" === (void 0 === e ? "undefined" : t(e)) && (e = JSON.stringify(e)), wx.showModal({
            title: "提示",
            content: e,
            showCancel: !1,
            success: function(t) {
                console.log(t.confirm && typeof n == 'function');
                // t.confirm && "function" == typeof confirm && n();
                t.confirm && typeof n == 'function' && n();
            }
        });
    },
    confirm: function(e, n, o) {
        "object" === (void 0 === e ? "undefined" : t(e)) && (e = JSON.stringify(e)), wx.showModal({
            title: "提示",
            content: e,
            showCancel: !0,
            success: function(t) {
                t.confirm ? "function" == typeof n && n() : "function" == typeof o && o();
            }
        });
    },
    loading: function(t) {
        void 0 !== t && "" != t || (t = "加载中"), wx.showToast({
            title: t,
            icon: "loading",
            duration: 5e6
        });
    },
    hideLoading: function() {
        wx.hideToast();
    },
    toast: function(t, e) {
        e || (e = "success"), wx.showToast({
            title: t,
            icon: e,
            duration: 1e3
        });
    },
    success: function(t) {
        wx.showToast({
            title: t,
            icon: "success",
            duration: 1e3
        });
    },
    upload: function(t,url) {
        var e = this;
        wx.chooseImage({
            success: function(n) {
                e.loading("正在上传...");
                var o = e.getUrl(url, {
                    file: "file"
                }), i = n.tempFilePaths;
                wx.uploadFile({
                    url: o,
                    filePath: i[0],
                    name: "file",
                    success: function(n) {
                        e.hideLoading();
                        var o = JSON.parse(n.data);
                        if (0 != o.error) e.alert("上传失败"); else if ("function" == typeof t) {
                            var i = o.files[0];
                            t(i);
                        }
                    }
                });
            }
        });
    },
    pdata: function(t) {
        return t.currentTarget.dataset;
    },
    data: function(t) {
        return t.target.dataset;
    },
    phone: function(t) {
        var e = this.pdata(t).phone;
        wx.makePhoneCall({
            phoneNumber: e
        });
    },
    pay: function(e, n, o) {
        return "object" == (void 0 === e ? "undefined" : t(e)) && ("function" == typeof n && (e.success = n, 
        "function" == typeof o && (e.fail = o), void wx.requestPayment(e)));
    },
    cartcount: function(t) {
        this.get("member/cart/count", {}, function(e) {
            t.setData({
                cartcount: e.cartcount
            });
        });
    },
    onShareAppMessage: function(t, e) {
        var n = getApp(), o = n.getCache("sysset"), i = o.share || {}, a = n.getCache("userinfo_id"), s = o.shopname || "", r = o.description || "";
        return i.title && (s = i.title), e && (s = e), i.desc && (r = i.desc), t = t || "/pages/index/index", 
        t = -1 != t.indexOf("?") ? t + "&" : t + "?", {
            title: s,
            desc: r,
            path: t + "mid=" + a
        };
    },
    str2Obj: function(t) {
        if ("string" != typeof t) return t;
        if (t.indexOf("&") < 0 && t.indexOf("=") < 0) return {};
        var n = t.split("&"), o = {};
        return e.each(n, function(t, e) {
            if (e.indexOf("=") > -1) {
                var n = e.split("=");
                o[n[0]] = n[1];
            }
        }), o;
    },
    //新增
    //判断是否存在上一页，不存在则跳转会首页 - 
    // newNavigateBack:function(pageUrl){
    //     var cps = getCurrentPages();
    //     console.log(cps);return false;
    //     var delta = 0;
    //     for (var i = cps.length - 1; i >= 0; i--) {
    //         if (cps[i].route == pageUrl) {
    //             if (delta == 0) {
    //                 // wx.navigateTo({
    //                 wx.reLaunch({
    //                     url: "/pages/index/index"
    //                 });
    //                 return;
    //             }
    //             wx.navigateBack({ delta: delta });
    //             return;
    //         }
    //         delta++;
    //     }
    //     // wx.navigateTo({
    //     //     url: "/pages/index/index"
    //     // });
    // },
    /* 修改了一下 */
    newNavigateBack:function(){
        var pageHistory = getCurrentPages();
        var route = pageHistory[0].route;
        var routeIndex= pageHistory.length-2,delta=0;

        // console.log(pageHistory);
        if(routeIndex>=0){
            route = pageHistory[routeIndex].route;
            delta = route;
            //暂时解决返回到购物车没有刷新的问题
            if(pageHistory[routeIndex].options.PageCur=='cart'){
                // console.log(pageHistory[0].route+'?PageCur=cart');
                // return false;
                wx.reLaunch({
                    url: '/'+pageHistory[0].route+'?PageCur=cart',
                });
                return false;
            }
            wx.navigateBack({ delta: delta });
            return;
        } else{
            wx.reLaunch({
                url: "/pages/index/index"
            });
            return;
        }
    },
    /*表单 - 输入*/
    onDataChange(that,obj){
        var i = obj.detail.value?obj.detail.value:this.pdata(obj).value, type = this.pdata(obj).type, d = that.data.postData;
        d[type] = e.trim(i);
        console.log(d);
        that.setData({
            postData: d
        });
    },
    ajax: function (url,moption) {
        var session_id = wx.getStorageSync('PHPSESSID');
        var access_token = wx.getStorageSync('access_token');
        var header = {
          'content-type': 'application/x-www-form-urlencoded'
        };
        if (session_id) {
          header.Cookie = 'PHPSESSID=' + session_id;
        }
        if (access_token) {
          header['Access-Token'] = access_token;
        }
        typeof (option.beforeSend) == 'function' ? option.beforeSend : null;
        wx.request({
          url: this.getUrl(url),
          method: 'POST',
          data: option.data,
          dataType: 'json',
          header: header,
          success(res) {
    
            if (res.data && res.data.session_id) {
              wx.setStorageSync('PHPSESSID', res.data.session_id); //把session_id保存本地
    
            }
            typeof (option.success) == 'function' ? option.success(res.data) : null;
          },
          fail: option.error,
          complete: option.complete
        });
    },
    //页面跳转
    goUrl(e){
        let url = this.pdata(e).url;
        console.log(url);
        url&&wx.navigateTo({
            url: this.pdata(e).url,
        })
    },
};