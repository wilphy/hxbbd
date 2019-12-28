// miniprogram/pages/player/player.js

//数据不需要在页面中显示，所以不写在data中
let musiclist = []
//正在播放的歌曲的index
let nowPlayingIndex = 0

//获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()

//用来获取全局属性
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
    isLyricShow: false, //歌词是否显示
    lyric: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },

  //获取音乐信息
  _loadMusicDetail(musicId) {
    backgroundAudioManager.stop() //播放下一首时先停止当前的播放
    let music = musiclist[nowPlayingIndex]
    // console.log(music)
    //设置标题
    wx.setNavigationBarTitle({
      title: music.name,
    })

    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false
    })

    //把当前播放歌曲的id设置成全局的
    app.setPlayMusicId(musicId)

    wx.showLoading({
      title: '歌曲加载中'
    })

    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl'
      }
    }).then(res => {
      // console.log(JSON.parse(res.result))
      let result = JSON.parse(res.result)
      backgroundAudioManager.src = result.data[0].url //播放地址
      backgroundAudioManager.title = music.name //歌曲名
      backgroundAudioManager.coverImgUrl = music.al.picUrl //歌曲封面
      backgroundAudioManager.singer = music.ar[0].name //歌手名

      this.setData({
        isPlaying: true
      })
      wx.hideLoading()

      //加载歌词
      wx.cloud.callFunction({
        name: "music",
        data: {
          musicId,
          $url: "lyric"
        }
      }).then(res => {
        // console.log(res)
        let lyric = "无歌词"
        const lrc = JSON.parse(res.result).lrc.lyric
        if (lrc) {
          lyric = lrc
        }
        this.setData({
          lyric
        })
      })
    })
  },

  //控制播放/暂停
  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }

    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  //上一首
  onPrev() {
    nowPlayingIndex-- //索引-1
    //如果当前为第一首，则返回歌单中最后一首
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1
    }
    //更新将要播放的歌曲
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },

  //下一首
  onNext() {
    nowPlayingIndex++ //索引+1
    //如果当前为最后一首，则返回第一首
    if (nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0
    }
    //更新将要播放的歌曲
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },

  //歌词显示
  toggleLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },

  //歌词与播放进度联动
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },

  //播放组件与小程序自带播放器的按钮联动
  onPlay() {
    this.setData({
      isPlaying: true
    })
  },
  onPause() {
    this.setData({
      isPlaying: false
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