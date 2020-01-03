const MAX_IMG_NUM = 9 //最大上传图片数量

const db = wx.cloud.database() //云数据库初始化

let content = '' //输入的文字内容

let userInfo = []

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0, //输入的字符个数
    images: [],
    selectPhoto: true // 添加图片元素是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    userInfo = options
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
    content = event.detail.value
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

  //发布
  send() {

    if (content.trim() === '') {
      wx.showModal({
        title: '请输入文字内容'
      })
      return
    }

    wx.showLoading({
      title: '发布中',
    })

    let promiseArr = []

    let fileIds = []

    //图片上传
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        let suffix = /\.\w+$/.exec(item)[0] //文件拓展名
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item,
          success: res => {
            console.log(res)
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: err => {
            console.error(err)
            reject()
          }
        })
      })
      promiseArr.push(p)
    }

    //存入云数据库中
    Promise.all(promiseArr).then((res) => {
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate() //服务端的时间
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })

        //返回blog页面,并且刷新
        wx.navigateBack()
        const pages = getCurrentPages()
        console.log(pages)
        const prevPage = pages[pages.length - 2] //取到上一个页面
        prevPage.onPullDownRefresh() //调用上一个页面的下拉刷新

      })
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
      })
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