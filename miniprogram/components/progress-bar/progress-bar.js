// components/progress-bar/progress-bar.js

let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSec = -1 //当前的秒数
let duration = 0 //当前歌曲的总时长，以秒为单位
//当前进度条是否被拖拽移动
let isMoving = false //解决：当进度条拖动时和updatetime事件的冲突

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    movableDis: 0,
    progress: 0
  },

  lifetimes: {
    ready() {
      this._getMovableDis()
      this._bindBGMEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec(rect => {
        // console.log(rect)
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        // console.log(movableAreaWidth, movableViewWidth)
      })
    },

    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
        isMoving = false
      })
      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })
      backgroundAudioManager.onPause(() => {
        console.log('onPause')
      })
      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })
      backgroundAudioManager.onCanplay(() => {
        console.log('onCanplay')
        if (typeof backgroundAudioManager.duration !== 'undefined') {
          // console.log(backgroundAudioManager.duration)
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })
      backgroundAudioManager.onTimeUpdate(() => {
        // console.log('onTimeUpdate')
        if (!isMoving) {
          const currentTime = backgroundAudioManager.currentTime
          const duration = backgroundAudioManager.duration

          const sec = currentTime.toString().split('.')[0]
          if (sec != currentSec) {
            // console.log(currentTime)
            const currentTimeFmt = this._dateFormat(currentTime)
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
            })
            currentSec = sec
          }
        }
      })

      backgroundAudioManager.onEnded(() => {
        console.log('onEnded')
        this.triggerEvent('musicEnd')
      })
      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode)
        wx.showToast({
          title: '错误' + res.errCode,
        })
      })
    },

    _setTime() {
      duration = backgroundAudioManager.duration
      // console.log(duration)
      const durationFmt = this._dateFormat(duration)
      // console.log(durationFmt)
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
      duration = duration
    },

    //格式化时间
    _dateFormat(sec) {
      const min = Math.floor(sec / 60)
      sec = Math.floor(sec % 60)
      return {
        'min': this._parse0(min),
        'sec': this._parse0(sec)
      }
    },
    //处理个位数的分/秒，补0
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    },

    //当用户拖拽进度条
    onChange(event) {
      console.log(event)
      //拖动
      if (event.detail.source === "touch") {
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        this.data.movableDis = event.detail.x
        isMoving = true
      }
    },
    //进度条拖拽完毕
    onTouchEnd() {
      const currentTimeFmt = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: currentTimeFmt.min + ':' + currentTimeFmt.sec
      })
      backgroundAudioManager.seek(duration * this.data.progress / 100)
      isMoving = false
    }
  }
})