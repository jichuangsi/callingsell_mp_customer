const app = getApp(), core = app.requirejs("core");
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    }, 
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    isHome: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      // let pageHistory = getCurrentPages();
      // var route = pageHistory[0].route;
      // var routeIndex= pageHistory.length-2;
      // if(routeIndex>=0){
      //   route = pageHistory[routeIndex].route;
      // }
      // core.newNavigateBack(route);
      core.newNavigateBack();
      // wx.navigateBack({
      //   delta: 1
      // });
    },
    toHome(){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  }
})