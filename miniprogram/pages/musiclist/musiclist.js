// miniprogram/pages/musclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listinfo: {}, //歌单信息
    musiclist: [] //歌曲列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    // console.log(options)
    wx.cloud.callFunction({
      name: 'music',
      data: {
        playlistId: options.playlistId,
        $url: 'musiclist'
      }
    }).then(res => {
      // console.log(res)
      this.setData({
        musiclist: res.result.playlist.tracks,
        listinfo: {
          coverImgUrl: res.result.playlist.coverImgUrl,
          name: res.result.playlist.name
        }
      })
      this._setMusiclist()
      wx.hideLoading()
    })
  },

  //存入storage
  _setMusiclist() {
    wx.setStorageSync('musiclist', this.data.musiclist)
  }

})