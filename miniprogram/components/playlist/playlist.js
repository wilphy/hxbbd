// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object
    }
  },

  observers: {
    ['playlist.playCount'](count) {
      // console.log(count)
      // console.log(this._transNumber(count, 2))
      this.setData({
        //不能再监听修改 ['playlist.playCount'] 的值，会形成死循环
        _count: this._transNumber(count, 2)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //数字转化处理
    //num为要处理的数字，point为小数点后几位
    _transNumber(num, point) {
      let numStr = num.toString().split('.')[0]
      if (numStr.length < 6) {
        return numStr
      } else if (numStr.length >= 6 && numStr.length <= 8) {
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
        return parseFloat(parseInt(num / 10000) + "." + decimal) + "万"
      } else if (numStr.length > 8) {
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point)
        return parseFloat(parseInt(num / 100000000) + "." + decimal) + "亿"
      }
    }
  }
})