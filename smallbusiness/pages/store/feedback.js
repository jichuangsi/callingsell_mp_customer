const app = getApp(),core = app.requirejs("core");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialogModal:!1,
    postData:{},
    contentLength:0,
    minLength:10,
    maxLength:200,
    images:[],
    imgs:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this,postData = that.data.postData;
    if(typeof(that.data.postData.cate)=='undefined'){
      postData.cate=1;
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
  /* onChange */
  onDataChange(e){
    console.log(this.data.postData);
    return core.onDataChange(this,e);
  },
  onTextAreaChange(e){
    var content = e.detail.value,data = this.data,maxLength = data.maxLength,minLength = data.minLength;
    if(content.length<=maxLength){
      this.setData({ contentLength:content.length });
      return core.onDataChange(this,e);
    } else{
      var postData=data.postData,message = '内容最多'+maxLength+'个字';
      core.alert(message);
      this.setData({
        postData:postData,
        contentLength:data.contentLength
      });
    }
    
  },
  /* 上传图片相关 */
  ChooseImage(t) {
    // wx.chooseImage({
    //   count: 4, //默认9
    //   sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
    //   sourceType: ['album'], //从相册选择
    //   success: (res) => {
    //     if (this.data.imgList.length != 0) {
    //       this.setData({
    //         imgList: this.data.imgList.concat(res.tempFilePaths)
    //       })
    //     } else {
    //       this.setData({
    //         imgList: res.tempFilePaths
    //       })
    //     }
    //   }
    // });
    var that = this, s = core.data(t), i = s.type, o = that.data.images, n = that.data.imgs, r = s.index, postData=that.data.postData;
    core.upload(function(t) {
        o.push(t.filename), n.push(t.url), postData.images=o, that.setData({
            images: o,
            imgs: n
        });
    },'ele/uploadImg');
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgs,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这图片吗？',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.images.splice(e.currentTarget.dataset.index, 1);
          this.data.imgs.splice(e.currentTarget.dataset.index, 1);
          this.data.postData.images = this.data.images;
          this.setData({
            images: this.data.images,
            imgs: this.data.imgs,
            postData:this.data.postData
          })
        }
      }
    })
  },
  /* 提交 */
  onSubmit(){
    var that=this, data = that.data,postData = data.postData,images = data.images;
    postData.images = images;

    if(postData.cate==undefined){core.alert('请选择反馈问题分类');return false;}
    if(postData.content==undefined){core.alert('请输入反馈内容');return false;}
    core.post("user/postFeedback",{postData:postData},function(res){
      // res.error!=1&&core.toast(res.message);
      res.error==0&&that.setData({
        showDialogModal:!0
      });
    });

    // this.setData({
    //   postData: postData,
    //   showDialogModal:!0
    // });
  },
  /* 隐藏提示框 */
  hideModal(){
    this.setData({
      showDialogModal:!1
    });
    let pageHistory = getCurrentPages();
    let route = pageHistory[0].route;
    core.newNavigateBack(route);
  }
})