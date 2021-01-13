const app = getApp(), core = app.requirejs("core");
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
    page:1,
    storeList:[],
  },
  /* 生命周期函数 */
  lifetimes: {
    created: function () {
      // 组件实例化，但节点树还未导入，因此这时不能用setData
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行 
      // 节点树完成，可以用setData渲染节点，但无法操作节点   
      core.loading();
      this.__proto__._getStoreList(this,this.data.page);
    },
    ready: function () {
      // 组件布局完成，这时可以获取节点信息，也可以操作节点

    },
    move: function () {
      // 组件实例被移动到树的另一个位置
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _getStoreList(that,page){
      core.get("ele/StoreList",{page:page},function(res){
        core.hideLoading();
        var list = that.data.storeList.concat(res.list);
        res.error==0 && that.setData({
          storeList:list,
          page:res.page
        });
      });
    }
  }
})
