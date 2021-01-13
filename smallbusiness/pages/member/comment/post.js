const app = getApp(),core = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData:{},
    contentLength:0,
    maxLength:200,
    images:[],
    imgs:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.id&&this.setData({id:options.id});
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
  select(e){
    var that=this,data=core.pdata(e),type=data.type,index=data.index,postData=that.data.postData;
    // type=='store'? that.setData({store:index}):type=='speed'?that.setData({speed:index}):that.setData({server:index});
    type=='store'? postData.store=index:type=='speed'?postData.speed=index:postData.server=index;
    this.setData({postData:postData});
    console.log(postData)
  },
  onTextAreaChange(e){
    var content = e.detail.value,data = this.data,maxLength = data.maxLength;
    if(content.length<=maxLength){
      this.setData({
        contentLength:content.length
      });
      return core.onDataChange(this,e);
    } else{
      var postData=data.postData,message = '内容最多'+maxLength+'个字';
      core.alert(message);
      this.setData({
        postData:postData,
      });
    }
  },
  // ChooseImage() {
  //   var that=this,postData=that.data.postData;
  //   wx.chooseImage({
  //     count: 4, //默认9
  //     sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album'], //从相册选择
  //     success: (res) => {
  //       if (this.data.imgList.length != 0) {
  //         this.setData({
  //           imgList: this.data.imgList.concat(res.tempFilePaths)
  //         })
  //       } else {
  //         this.setData({
  //           imgList: res.tempFilePaths
  //         })
  //       }
  //       let url = 
  //       wx.uploadFile({
  //         url: o,
  //         filePath: i[0],
  //         name: "file",
  //         success: function(n) {
  //             e.hideLoading();
  //             var o = JSON.parse(n.data);
  //             if (0 != o.error) e.alert("上传失败"); else if ("function" == typeof t) {
  //                 var i = o.files[0];
  //                 t(i);
  //             }
  //         }
  //     });
  //       postData.imgList=this.data.imgList;
  //       that.setData({postData:postData});
  //     }
  //   });
  // },
  ChooseImage(t) {
    var that = this, s = core.data(t), i = s.type, o = that.data.images, n = that.data.imgs, r = s.index, postData=that.data.postData;;
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
    var that=this,postData=that.data.postData;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgs.splice(e.currentTarget.dataset.index, 1);
          this.data.images.splice(e.currentTarget.dataset.index, 1);
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
  upload: function(t) {
    var that = this, s = core.data(t), i = s.type, o = that.data.images, n = that.data.imgs, r = s.index;
    "image" == i ? core.upload(function(t) {
        o.push(t.filename), n.push(t.url), that.setData({
            images: o,
            imgs: n
        });
    }) : "image-remove" == i ? (o.splice(r, 1), n.splice(r, 1), that.setData({
        images: o,
        imgs: n
    })) : "image-preview" == i && wx.previewImage({
        current: n[r],
        urls: n
    });
  },
  onSubmit(){
    var that=this,postData=that.data.postData;
    postData.orderid=that.data.id;
    postData.images=that.data.images;

    if(postData.store==undefined){core.alert('请评价店铺');return false;}
    if(postData.speed==undefined){core.alert('请评价拎手送货速度');return false;}
    if(postData.store==undefined){core.alert('请评价拎手服务态度');return false;}
    if(postData.content==undefined){core.alert('请输入评价内容');return false;}
    core.post("ele/postComment",{postData:postData},function(res){
      res.error!=1&&core.toast(res.message);
      res.error!=1&&setTimeout(function() {
        core.newNavigateBack();
      },1300);
    });
  }
})