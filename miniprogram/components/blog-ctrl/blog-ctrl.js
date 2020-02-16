// components/blog-ctrl/blog-ctrl.js

let userInfo = {}

const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String
  },

  //组件样式传递
  externalClasses: [
    'iconfont',
    'icon-pinglun',
    'icon-share_icon'
  ],

  /**
   * 组件的初始数据
   */
  data: {
    content: '', //评论内容
    loginShow: false, // 登录组件是否显示
    modalShow: false //底部弹出层是否显示
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      //判断用户是否授权
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                //显示评论的弹出层
                this.setData({
                  modalShow: true
                })
              }
            })
          } else {
            this.setData({
              loginShow: true
            })
          }
        }
      })
    },

    onLoginSuccess(event) {
      userInfo = event.detail
      //授权框消失后显示评论框
      this.setData({
        loginShow: false
      }, () => {
        this.setData({
          modalShow: true
        })
      })
    },

    onLoginFail() {
      wx.showModal({
        title: '授权用户才能评论',
        content: ''
      })
    },

    //发送评论
    onSend(event) {
      console.log(event)
      //插入数据库
      let content = event.detail.value.content
      if (content.trim() == '') {
        wx.showModal({
          title: '评论内容不能为空',
        })
        return
      }
      wx.showLoading({
        title: '评论中',
        mask: true
      })
      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '评论成功'
        })
        this.setData({
          modalShow: false,
          content: ''
        })
      })

      // 通知父元素刷新评论页面
      this.triggerEvent('refreshCommentList')
    }
  }
})