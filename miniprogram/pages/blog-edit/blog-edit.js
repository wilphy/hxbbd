const MAX_IMG_NUM = 9 //最大上传图片数量

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0, //输入的字符个数
    images: [],
    selectPhoto: true // 添加图片元素是否显示
  },

  // 监听输入
  onInput(event) {
    // console.log(event.detail.value)
    const wordsNum = event.detail.value.length
    if (wordsNum >= 140) {
      wx.showModal({
        title: '最大输入为140个字符',
      })
    }
    this.setData({
      wordsNum
    })
  },

  //选择图片
  onChooseImg() {
    let max = MAX_IMG_NUM - this.data.images.length // 还能再选几张图片
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        // 还能再选几张图片
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      },
    })
  },

  //删除图片
  onDelImg(event) {
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    if (this.data.images.length === MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true
      })
    }
  },

  //图片预览
  onPreviewImg(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
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