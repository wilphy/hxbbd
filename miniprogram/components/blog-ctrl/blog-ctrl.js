// components/blog-ctrl/blog-ctrl.js

let userInfo = {}

Component({
  /**
   * 组件的属性列表
   */
  properties: {

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

    onLoginSuccess() {
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
    }
  }
})