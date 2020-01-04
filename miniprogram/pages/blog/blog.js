// miniprogram/pages/blog/blog.js

let keyword = '' //搜索的关键字

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false, //控制底部弹出层是否显示
    blogList: [] //博客列表
  },

  //发布功能
  onPublish() {
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              // console.log(res)
              this.onLoginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else {
          this.setData({
            modalShow: true
          })
        }
      }
    })
  },

  //授权成功
  onLoginSuccess(event) {
    console.log(event)
    const detail = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },

  //授权失败
  onLoginFail() {
    wx.showModal({
      title: '未授权',
      content: '',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },

  //搜索
  onSearch(event) {
    console.log(event.detail.keyword)
    this.setData({
      blogList: []
    })
    keyword = event.detail.keyword
    this._loadBlogList(0)
  },

  //加载博客
  _loadBlogList(start = 0) {
    wx.showLoading({
      title: 'loading...',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        keyword, //搜索关键字
        start,  
        $url: 'list', 
        count: 5 //每次获取的数量
      }
    }).then(res => {
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
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
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})