// miniprogram/pages/player/player.js

//数据不需要在页面中显示，所以不写在data中
let musiclist = []
//正在播放的歌曲的index
let nowPlayingIndex = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail()
  },

  _loadMusicDetail() {
    let music = musiclist[nowPlayingIndex]
    console.log(music)
    //设置标题
    wx.setNavigationBarTitle({
      title: music.name,
    })

    this.setData({
      picUrl: music.al.picUrl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})