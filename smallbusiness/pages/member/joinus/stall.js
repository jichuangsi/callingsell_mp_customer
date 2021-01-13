const app=getApp(),core = app.requirejs('core'),jq = app.requirejs('jquery');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cansend:1,
    wait:90,
    shopFront:[],
    shopFrontView:[],
    idCard:[],
    idCardView:[],
    pic3:[],
    pic3View:[],
    postData:{},
    addressArray:[
      [],
      [],
      []
    ],
    value: [18,0,0],
    valueid: [19,0,0],
    multiArray:[],
    switch1Checked:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断当前是否有定位地址
    let postData = this.data.postData
    if(app.getCache('addr')){
      postData.address = app.getCache('addr')
      this.setData({
        postData:postData
      })
    }
    this.getAllProvinceList()
    let that = this
    core.get("user/getShopCateListById",{},function(res){
      console.log(res)
      that.setData({
        multiArray:res
      });
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this, data = that.data,postData = data.postData;
    //判断地址
    if(typeof(postData.region)=='undefined'){
      postData.region = [];
      postData.category_name = '';
      postData.category_id = '';
      that.setData({
        postData:postData
      });
    }
    
    //提交申请和审核通过期间，或者已经审核通过
    core.get("user/isApplyStore",{userid:app.getCache('userinfo').id},function(res){
      res.error&&core.alert(res.message,function(){
        core.newNavigateBack();
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let radiusKM = app.getCache('radius'),postData=this.data.postData;
    if(radiusKM){
      postData.radiusKM=radiusKM;
      this.setData({
        postData:postData
      });
    }
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
  goUrl(e){
    wx.navigateTo({
      url: core.pdata(e).url,
    })
  },
  getAllProvinceList(){
    // 省
    let self = this
    core.get('EleStore/getAllProvinceList',{},function(res){
      console.log(res);
      var addressArray = self.data.addressArray;
      var valueid = self.data.valueid;
      console.log(addressArray)
      addressArray[0] = res
      valueid[0] = res[18].id
      console.log(1111)
      self.getcityList(res[18].id)
      console.log(52222)
      self.setData({
        addressArray: addressArray,
        valueid: valueid
      })
    })
  },
  getcityList(id){
    // 市
    let self = this
    core.get('EleStore/getCityListByProvince?id='+id,{},function(res){
      console.log(res);
        var addressArray = self.data.addressArray;
        var valueid = self.data.valueid;
        addressArray[1] = res
        valueid[1] = res[0].id
        self.getareaList(res[0].id)
        self.setData({
          addressArray: addressArray,
          valueid: valueid
        })
    })
  },
  getareaList(id){
    // 区
    let self = this
    core.get('EleStore/getCityListByProvince?id='+id,{},function(res){
      console.log(res);
        var addressArray = self.data.addressArray;
        var valueid = self.data.valueid;
        addressArray[2] = res
        valueid[2] = res[0].id
        self.setData({
          addressArray: addressArray,
          valueid: valueid
        })
    })
  },
  /* 地址选择 */
  RegionChange: function(e) {
    var postData = this.data.postData;
    var addressArray = this.data.addressArray;
    postData.region = [addressArray[0][e.detail.value[0]].name,addressArray[1][e.detail.value[1]].name,addressArray[2][e.detail.value[2]].name]
    postData.region_id = [addressArray[0][e.detail.value[0]].id,addressArray[1][e.detail.value[1]].id,addressArray[2][e.detail.value[2]].id]
    console.log(e);
    this.setData({
      postData: postData
    })
    console.log(this.data.postData)
  },
  /* 地址切换 */
  bindMultiPickerColumnChange: function(e) {
    console.log(e);
    if(e.detail.column==0){
      this.getcityList(this.data.addressArray[0][e.detail.value].id)
    }else if(e.detail.column==1){
      this.getareaList(this.data.addressArray[1][e.detail.value].id)
    }
  },
  /* 类目选择 */
  CategoryChange: function(e) {
    console.log(e)
    var postData = this.data.postData;
    postData.category_id = this.data.multiArray[e.detail.value].category_id
    postData.category_name = this.data.multiArray[e.detail.value].name
    // postData.postcode = e.detail.postcode
    // console.log(e);
    this.setData({
      postData: postData
    })
  },
  /* 地址选择 */
  // RegionChange: function(e) {
  //   var postData = this.data.postData;
  //   postData.region = e.detail.value
  //   postData.postcode = e.detail.postcode
  //   this.setData({
  //     postData: postData
  //   })
  // },
  /* 数据输入 */
  onDataChange(e){
    return core.onDataChange(this,e);
  },
  getVerifyCode(){
    var that = this,data = that.data,cansend = data.cansend,postData = data.postData;
    if(!postData.phone){ core.alert('请先输入手机号码');return false;}
    if(!jq.isMobile(postData.phone)){ core.alert('请输入正确的手机号码');return false;}
    if(!cansend){
      return ;
    }
    // core.toast('已发送，请稍等');
    // that.setData({
    //   cansend:!cansend,
    // });
    // this.setInterval();
    core.get("VerifyCode/getCode",{phone:postData.phone},function(res){
      console.log(res)
      res.SendStatusSet[0].Code=="Ok"&&that.setData({
        cansend:0,
      }),core.toast('已发送，请稍等'),that.setInterval();
    });
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
  // ChooseImage(e){
  //   var type = core.pdata(e).type,count=1;
  //   if(type=="idCard"){
  //     count=2;
  //   }
  //   console.log(count);
  //   wx.chooseImage({
  //     count: count, //默认9
  //     sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album'], //从相册选择
  //     success: (res) => {
  //       if(type=="shopFront"){
  //         this.setData({shopFront: res.tempFilePaths})
  //       } else{
  //         if (this.data.idCard.length != 0) {
  //           this.setData({
  //             idCard: this.data.idCard.concat(res.tempFilePaths)
  //           })
  //         } else {
  //           this.setData({
  //             idCard: res.tempFilePaths
  //           })
  //         }
  //       }
  //     }
  //   });
  // },
  ChooseImage(e){
    var that = this, postData=that.data.postData , type = core.pdata(e).type;
    console.log(type)
    if(type=='shopFront'){
      var images = that.data.shopFront, imgs = that.data.shopFrontView;
    } else if(type=='idCard'){
      var images = that.data.idCard, imgs = that.data.idCardView;
    } else{
      var images = that.data.pic3, imgs = that.data.pic3View;
    }
    core.upload(function(res) {
      console.log(images)
      console.log(res)
      console.log(imgs)
        images.push(res.filename), imgs.push(res.url);
        if(type=='shopFront'){
          postData.shopFront=images;
          that.setData({  shopFront: images,  shopFrontView: imgs , postData:postData});
        } else if(type=='idCard'){
          postData.idCard=images;
          that.setData({  idCard: images,  idCardView: imgs , postData:postData});
        } else{
          postData.pic3=images;
          that.setData({  pic3: images,  pic3View: imgs , postData:postData});
        }
    },'ele/uploadImg');
  },
  //预览
  ViewImage(e) {
    var type = core.pdata(e).type,urls = '';
    if(type=="shopFront"){
      urls = this.data.shopFrontView;
    } else if(type=='idCard'){
      urls = this.data.idCardView;
    }else{
      urls = this.data.pic3View;
    }
    wx.previewImage({
      urls: urls,
      current: e.currentTarget.dataset.url
    });
  },
  //删除图片
  DelImg(e) {
    var type = core.pdata(e).type,postData = this.data.postData ;
    wx.showModal({
      title: '提示',
      content: '确定要删除这图片吗？',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          // if(type=="shopFront"){
          //   this.setData({shopFront: ''})
          // } else{
          //   this.data.idCard.splice(e.currentTarget.dataset.index, 1);
          //   this.setData({idCard: this.data.idCard})
          // }
          
          if(type=="shopFront"){
            postData.shopFront='';
            this.setData({shopFront: '',shopFrontView: '',postData:postData})
          } else if(type=='idCard'){
            this.data.idCard.splice(e.currentTarget.dataset.index, 1);
            this.data.idCardView.splice(e.currentTarget.dataset.index, 1);
            this.setData({idCard: this.data.idCard})
            postData.idCard=this.data.idCard;
            this.setData({idCard: this.data.idCard,idCardView: this.data.idCardView,postData:postData})
          } else{
            postData.pic3='';
            this.setData({pic3: '',pic3View: '',postData:postData})
          }
        }
      }
    })
  },
  switch1Change(e){
    this.setData({
      switch1Checked:e.detail.value[0]?true:false
    })
  },
  onSubmit(){
    var that = this,postData = that.data.postData,message = '';

    console.log(postData)

    if(!postData.shopname) return core.alert('摊位名称不能为空');
    if(!postData.region) return core.alert('请选择摊位所在地区');
    if(!postData.address) return core.alert('请输入详细地址');
    // if(!postData.address1) return core.alert('请输入具体地址');
    if(!postData.username) return core.alert('联系人不能为空');
    if(!postData.phone) return core.alert('手机号码不能为空');
    if(!jq.isMobile(postData.phone)) return core.alert('请输入正确的手机号码');
    if(!postData.shopFront) return core.alert('请上传摊位图片');
    if(!postData.idCard) return core.alert('请上传您的身份证');
    if(postData.idCard.length!=2) return core.alert('请上传您的身份证');
    if(!postData.category_id) return core.alert('请选择商户类目');
    if((postData.category_id==85||postData.category_id==83||postData.category_id==96)&&!postData.pic3) return core.alert('请上传您的食品经营许可证');
    if(!that.data.switch1Checked) return core.alert('请勾选同意服务协议');

    postData.province_id = postData.region_id[0]
    postData.city2_id = postData.region_id[1]
    postData.region_id = postData.region_id[2]
    postData.full_address = postData.region[0]+postData.region[1]+postData.region[2]+postData.address

    postData.id_card_pic1 = postData.idCard[0]
    postData.id_card_pic2 = postData.idCard[1]
    // postData.address = postData.address + postData.address1
    wx.requestSubscribeMessage({
    tmplIds: ['Uu8qSuBjqbo-vNhgqtoscjFi0HH9wKfmCVkOm9pdJ8k'],
    success (res) { 
      core.post("user/applyStore",{postData:postData},function(res){
        console.log(1122)
        console.log(res)
        res.error==0?core.alert(res.message,function(){
          app.removeCache('radius');
          wx.navigateBack({
            delta: 1,
          })
        }):core.alert(res.message);
      });
    },fail(err){
      console.log(222)
      console.log(err)
      core.alert('请同意订阅消息通知')
    }
  })
    // core.post("user/postAddress",{postData:postData},function(res){
    //   message = postData.id?'修改成功':'添加成功';
    //   core.toast(message);
    //   setTimeout(function() {
    //     core.newNavigateBack();
    //   },1300);
    // });
    // core.toast("提交成功");
    // setTimeout(function() {
    //   core.newNavigateBack();
    // },1300);
  },
})