const app = getApp(), core = app.requirejs('core'),jq = app.requirejs('jquery');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cansend:1,
    wait:90,
    idCardFront:[],
    idCardFrontView:[],
    idCardBack:[],
    idCardBackView:[],
    postData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    //提交申请和审核通过期间
    core.get("user/isApplyDelivery",{userid:app.getCache('userinfo').id},function(res){
      res.error&&core.alert(res.message,function(){
        core.newNavigateBack();
      });
    });
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
  onDataChange(e){
    return core.onDataChange(this,e);
  },
  getVerifyCode(){
    // var that = this,data = that.data,cansend = data.cansend;
    var that = this,data = that.data,cansend = data.cansend,postData = data.postData;
    if(!postData.phone){ core.alert('请先输入手机号码');return false;}
    if(!jq.isMobile(postData.phone)){ core.alert('请输入正确的手机号码');return false;}
    if(!cansend){
      return ;
    }
    core.get("VerifyCode/getCode",{phone:postData.phone},function(res){
      res.SendStatusSet[0].Code=="Ok"&&that.setData({
        cansend:0,
      }),core.toast('已发送，请稍等'),that.setInterval();
    });
    // core.toast('已发送，请稍等');
    // that.setData({
    //   cansend:!cansend,
    // });
    // this.setInterval();
  },
  setInterval(){
    var that=this;
    this.data.setInterval = setInterval(
      function(){
        var cansend = that.data.cansend,wait = that.data.wait;
        wait>=1?wait=wait-1:(cansend=!cansend,wait=90,clearInterval(that.data.setInterval));
        that.setData({
          cansend:cansend,
          wait:wait
        });
      },1e3);
  },
  ChooseImage(e){
    var that = this, postData=that.data.postData , type = core.pdata(e).type;
    if(type=='idCardFront'){
      var images = that.data.idCardFront, imgs = that.data.idCardFrontView;
    } else{
      var images = that.data.idCardBack, imgs = that.data.idCardBackView;
    }
    core.upload(function(res) {
      images.push(res.filename), imgs.push(res.url);
      if(type=='idCardFront'){
        postData.idCardFront=images;
        that.setData({  idCardFront: images,  idCardFrontView: imgs , postData:postData});
      } else{
        postData.idCardBack=images;
        that.setData({  idCardBack: images,  idCardBackView: imgs , postData:postData});
      }
  },'ele/uploadImg');
  },
  ViewImage(e) {
    var type = core.pdata(e).type,urls = '';
    if(type=="idCardFront"){
      urls = this.data.idCardFrontView;
    } else{
      urls = this.data.idCardBackView;
    }
    wx.previewImage({
      urls: urls,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    var type = core.pdata(e).type;
    wx.showModal({
      title: '提示',
      content: '确定要删除这图片吗？',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          if(type=="idCardFront"){
            postData.idCardFront='';
            this.setData({idCardFront: '',idCardFrontView: '',postData:postData})
          } else{
            postData.idCardBack='';
            this.setData({idCardBack: '',idCardBackView: '',postData:postData})
          }
        }
      }
    })
  },
  onSubmit(){
    console.log(app.getCache('userinfo'));
    var that = this,postData = that.data.postData,message = '';
    if(!postData.username) return core.alert('联系人姓名不能为空');
    if(!postData.phone) return core.alert('手机号码不能为空');
    if(!jq.isMobile(postData.phone)) return core.alert('请输入正确的手机号码');
    if(!postData.idCardFront) return core.alert('请上传你的身份证正面');
    if(!postData.idCardBack) return core.alert('请上传你的身份证背面');

    core.post("user/applyDelivery",{postData:postData},function(res){
      res.error==0&&core.alert(res.message,function(){
        wx.navigateBack({
          delta: 1,
        })
      });
    });
    // message = '提交成功，稍后会有工作人员处理';
    // core.toast(message);
    // setTimeout(function() {
    //   core.newNavigateBack();
    // },1300);
  }
})