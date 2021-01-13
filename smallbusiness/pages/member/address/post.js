const app = getApp(), core = app.requirejs('core'),jq = app.requirejs('jquery');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showDialogModal:!1,
    postData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this, data = that.data,postData = data.postData;
    //判断是否有id传入
    if(options.id){
      core.loading();
      postData.id = options.id
      core.get('user/getAddress',{id:options.id},function(res){
        if(res.error==0){
          // if(res.address.addr1){
          //   postData.username=res.address.name,
          //   postData.phone=res.address.mobile,
          //   postData.region=[res.address.province,res.address.city,res.address.area],
          //   postData.address=res.address.addr1,
          //   postData.address1=res.address.addr2,
          //   postData.isDefault=res.address.is_default?true:false,
          //   that.setData({
          //     postData:postData
          //   });
          // }else{
            postData.username=res.address.name,
            postData.phone=res.address.mobile,
            postData.region=[res.address.province,res.address.city,res.address.area],
            postData.address=res.address.addr,
            postData.isDefault=res.address.is_default?true:false,
            that.setData({
              postData:postData
            });
          // }
        }
        core.hideLoading();
        // res.error==0 && that.setData({
        //   address:res.address,
        //   postData:postData
        // });
      });
    }
    //判断收货地址
    if(typeof(postData.region)=='undefined'){
      postData.region = [];
      postData.address = app.getCache('addr')
      that.setData({
        postData:postData
      });
    }
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
  /* 地址选择 */
  RegionChange: function(e) {
    var postData = this.data.postData;
    postData.region = e.detail.value
    postData.postcode = e.detail.postcode
    console.log(e.detail);
    this.setData({
      postData: postData
    })
  },
  /* 数据输入 */
  onDataChange(e){
    return core.onDataChange(this,e);
  },
  isDefault(e){
    var postData = this.data.postData;
    postData.isDefault = e.detail.value;
    this.setData({
      postData:postData
    });
  },
  onSubmit(){
    var that = this,postData = that.data.postData,message = '';
    if(!postData.username) return core.alert('收货人姓名不能为空');
    if(!postData.phone) return core.alert('手机号码不能为空');
    if(!jq.isMobile(postData.phone)) return core.alert('请输入正确的手机号码');
    if(!postData.region[0]) return core.alert('请选择所在地区');
    if(!postData.address) return core.alert('请输入详细地址');
    // if(!postData.address1) return core.alert('请输入具体地址');
    // postData.addr1 = postData.address
    // postData.addr2 = postData.address1
    // postData.address = postData.address + postData.address1
    console.log(postData)
    core.post("user/postAddress",{postData:postData,userid:app.getCache('userinfo').id},function(res){
      message = postData.id?'修改成功':'添加成功';
      core.toast(message);
      setTimeout(function() {
        core.newNavigateBack();
      },1300);
    });
  }
})