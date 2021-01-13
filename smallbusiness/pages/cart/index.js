const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PageCur:"cart",
    cartList:[
      {
        id:0,
        shopname:"麦当劳麦乐送（广州天河店）",
        goods:[{
          id:0,
          name:'双层麦辣鸡翅堡套餐',
          img:'/images/cart.png',
          spec:'规格1',
          num:2,
          price:10.00,
          marketprice:12.00,
          totalprice:20.00,
          deliveryFee:8,
          isNew:1,
          newReduce:5
        },
        {
          id:0,
          name:'双层麦辣鸡翅堡套餐2',
          spec:'规格2',
          num:2,
          price:10.00,
          marketprice:13.00,
          totalprice:20.00,
          deliveryFee:8,
          isNew:1,
          newReduce:6
        }],
      }
    ],
    storeList:[
      {
        img:'/images/shop-01.png',
        name:'麦当劳麦乐送（广州天河店）',
        rank:'4.5',
        sale:1010,
        minOrderPrice:15,
        deliveryFee:8,
        isArrive:1,
        isNew:1,
        newReduce:5,
        isFullReduce:1,
        fullReduce:[
          {
            price:30,
            reduce:2
          },
          {
            price:50,
            reduce:5
          }
        ],
      },
      {
        img:'/images/shop-01.png',
        name:'麦当劳麦乐送（广州天河店）2',
        rank:'4.5',
        sale:1010,
        minOrderPrice:15,
        deliveryFee:8,
        isArrive:1,
        isNew:0,
        newReduce:5,
        isFullReduce:1,
        fullReduce:[
          {
            price:30,
            reduce:2
          },
          {
            price:50,
            reduce:5
          }
        ],
      }
    ],
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

  }
})