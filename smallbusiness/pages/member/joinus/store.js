const app=getApp(),core = app.requirejs('core'),jq = app.requirejs('jquery');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cansend:1,
    cansubmit:1,
    wait:90,
    shopFront:[],
    shopFrontView:[],
    licenseFront:[],
    licenseFrontView:[],
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
    // multiArray: [['超市'], ['便利店'], ['肉菜市场'], ['新鲜水果'], ['餐饮'], ['农贸自售'], ['其他']],
    multiArray: [{
      id: 83,
      name: '超市'
    },{
      id: 96,
      name: '便利店'
    },{
      id: 3,
      name: '肉菜市场'
    },{
      id: 4,
      name: '新鲜水果'
    },{
      id: 85,
      name: '餐饮'
    },{
      id: 0,
      name: '农贸自售'
    },{
      id: 0,
      name: '其他'
    },],
    switch1Checked:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getAllProvinceList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 判断当前是否有定位地址
    let postData = this.data.postData
    if(app.getCache('addr')){
      postData.address = app.getCache('addr')
      this.setData({
        postData:postData
      })
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
    let userInfo = app.getCache('userInfo');
    // wx.navigateToMiniProgram({
    //   appId: 'wxaadd17a08612822f',
    //   path: 'page/index/index?from=user',
    //   extraData: {
    //     openid: userInfo.openid,
    //     unionid: userInfo.unionid,
    //   },
    //   envVersion: 'release',
    //   success(res) {
    //     // 打开成功
    //     console.log(res);
    //     // res.errMsg == 'navigateToMiniProgram:ok' && 
    //   },fail:function(res){
    //     res.errMsg=="navigateToMiniProgram:fail cancel"&&wx.navigateBack({
    //       delta: 1,
    //     })
    //   }
    // })
    let radiusKM = app.getCache('radius'),postData=this.data.postData;
    if(radiusKM){
      postData.radiusKM=radiusKM;
      this.setData({
        postData:postData
      });
    }
    let that = this
    core.get("user/getShopCateListById",{},function(res){
      console.log(res)
      that.setData({
        multiArray:res
      });
    })
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
  ChooseImage(e){
    var that = this, postData=that.data.postData , type = core.pdata(e).type;
    if(type=='shopFront'){
      var images = that.data.shopFront, imgs = that.data.shopFrontView;
    } else if(type=='licenseFront'){
      var images = that.data.licenseFront, imgs = that.data.licenseFrontView;
    } else{
      var images = that.data.pic3, imgs = that.data.pic3View;
    }
    core.upload(function(res) {
        images.push(res.filename), imgs.push(res.url);
        if(type=='shopFront'){
          postData.shopFront=images;
          that.setData({  shopFront: images,  shopFrontView: imgs , postData:postData});
        } else if(type=='licenseFront'){
          postData.licenseFront=images;
          that.setData({  licenseFront: images,  licenseFrontView: imgs , postData:postData});
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
    } else if(type=='licenseFront'){
      urls = this.data.licenseFrontView;
    } else{
      urls = this.data.pic3View;
    }
    wx.previewImage({
      urls: urls,
      current: e.currentTarget.dataset.url
    });
  },
  //删除图片
  DelImg(e) {
    var postData = this.data.postData ,type = core.pdata(e).type;
    wx.showModal({
      title: '提示',
      content: '确定要删除这图片吗？',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          if(type=="shopFront"){
            postData.shopFront='';
            this.setData({shopFront: '',shopFrontView: '',postData:postData})
          } else if(type=='licenseFront'){
            postData.licenseFront='';
            this.setData({licenseFront: '',licenseFrontView: '',postData:postData})
          } else{
            postData.pic3='';
            this.setData({pic3: '',pic3View: '',postData:postData})
          }
        }
      }
    })
  },
  goUrl(e){
    wx.navigateTo({
      url: core.pdata(e).url,
    })
  },
  switch1Change(e){
    this.setData({
      switch1Checked:e.detail.value[0]?true:false
    })
  },
  onSubmit(){
    var that = this,postData = that.data.postData,message = '',cansubmit=that.data.cansubmit;
    console.log(that.data.switch1Checked)
    console.log(postData)
    that.setData({cansubmit:0});
    if(!postData.shopname) return core.alert('商户名称不能为空');
    if(!postData.region) return core.alert('请选择商户所在地区');
    if(!postData.address) return core.alert('请输入商户详细地址');
    // if(!postData.address1) return core.alert('请输入商户具体地址');
    if(!postData.username) return core.alert('联系人不能为空');
    if(!postData.phone) return core.alert('手机号码不能为空');
    if(!jq.isMobile(postData.phone)) return core.alert('请输入正确的手机号码');
    if(!postData.shopFront) return core.alert('请上传商铺LOGO或门头');
    if(!postData.licenseFront) return core.alert('请上传您的营业执照');
    
    if(!postData.category_id) return core.alert('请选择商户类目');
    if((postData.category_id==85||postData.category_id==83||postData.category_id==96)&&!postData.pic3) return core.alert('请上传您的食品经营许可证');
    if(!that.data.switch1Checked) return core.alert('请勾选同意服务协议');
    postData.province_id = postData.region_id[0]
    postData.city2_id = postData.region_id[1]
    postData.region_id = postData.region_id[2]
    postData.full_address = postData.region[0]+postData.region[1]+postData.region[2]+postData.address
    // postData.address = postData.address + postData.address1
    wx.requestSubscribeMessage({
      tmplIds: ['Uu8qSuBjqbo-vNhgqtoscjFi0HH9wKfmCVkOm9pdJ8k'],
      success (res) { 
        console.log(1111)
        console.log(res)
        cansubmit&&core.post("user/applyStore",{postData:postData},function(res){
          res.error==0?core.alert(res.message,function(){
            app.removeCache('radius');
            wx.navigateBack({
              delta: 1,
            })
          }):core.alert(res.message);
        }),that.setData({cansubmit:1});
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
    // core.toast(提交成功);
    // setTimeout(function() {
    //   core.newNavigateBack();
    // },1300);
  },
})