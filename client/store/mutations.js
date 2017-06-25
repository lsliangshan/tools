/***
 **                                                          _ooOoo_
 **                                                         o8888888o
 **                                                         88" . "88
 **                                                         (| -_- |)
 **                                                          O\ = /O
 **                                                      ____/`---'\____
 **                                                    .   ' \\| |// `.
 **                                                     / \\||| : |||// \
 **                                                   / _||||| -:- |||||- \
 **                                                     | | \\\ - /// | |
 **                                                   | \_| ''\---/'' | |
 **                                                    \ .-\__ `-` ___/-. /
 **                                                 ___`. .' /--.--\ `. . __
 **                                              ."" '< `.___\_<|>_/___.' >'"".
 **                                             | | : `- \`.;`\ _ /`;.`/ - ` : | |
 **                                               \ \ `-. \_ __\ /__ _/ .-` / /
 **                                       ======`-.____`-.___\_____/___.-`____.-'======
 **                                                          `=---='
 **
 **                                       .............................................
 **                                              佛祖保佑             永无BUG
 **                                      佛曰:
 **                                              写字楼里写字间，写字间里程序员；
 **                                              程序人员写程序，又拿程序换酒钱。
 **                                              酒醒只在网上坐，酒醉还来网下眠；
 **                                              酒醉酒醒日复日，网上网下年复年。
 **                                              但愿老死电脑间，不愿鞠躬老板前；
 **                                              奔驰宝马贵者趣，公交自行程序员。
 **                                              别人笑我忒疯癫，我笑自己命太贱；
 **                                              不见满街漂亮妹，哪个归得程序员？
 */
/**
 * Created by liangshan on 2017/5/17.
 */
import store from './'
import * as types from './mutation-types'
import * as utils from '../utils/index'

export const mutations = {
  [types.SET_THEME] (state, data) {
    state.theme = data.theme
  },
  [types.NEED_MASK] (state, data) {
    state.showMask = data.shown
  },
  [types.INSERT_TIP] (state, data) {
    const _uid = utils.getUUID('global_tip_' + (+new Date()))
    if (!state.globalTips.hasOwnProperty(_uid)) {
      state.globalTips[_uid] = Object.assign({}, {
        type: 'success',
        message: '这是提示内容',
        cancel: true,
        duration: 3000,
        animationIn: 'fadeIn',
        animationOut: 'fadeOut'
      }, data)
      store.vms.app.$forceUpdate()
      const hideTimeout = setTimeout(function () {
        store.vms[_uid].shown = false
        delete state.globalTips[_uid]
        clearTimeout(hideTimeout)
      }, data.duration || 3000)
    }
  },
  [types.DEL_TIP] (state, data) {
    if (state.globalTips.hasOwnProperty(data.id)) {
      store.vms[data.id].shown = false
      delete state.globalTips[data.id]
    }
  },
  [types.OPEN_DIALOG] (state, data) {
    if (data) {
      state.globalDialog = {
        shown: true,
        title: data.title ? data.title : '提示',
        content: data.content ? data.content : '',
        contentHtml: data.contentHtml ? data.contentHtml : '',
        okText: data.okText ? data.okText : '确认',
        cancelText: data.cancelText ? data.cancelText : null,
        ok: data.ok ? data.ok : function () {},
        cancel: data.cancel ? data.cancel : function () {},
        from: data.from ? data.from : null,
        to: data.to ? data.to : null
      }
    } else {
      state.globalDialog = {
        shown: true,
        title: '提示',
        content: '提示内容',
        contentHtml: '',
        okText: '确认',
        cancelText: null,
        ok: function () {},
        cancel: function () {},
        from: null,
        to: null
      }
    }
    store.vms['globalDialog'].openDialog('globalDialog')
  },
  [types.OPEN_ALERT] (state, data) {
    if (data) {
      state.globalAlert = {
        shown: true,
        title: data.title ? data.title : '标题',
        content: data.content ? data.content : '弹窗内容',
        contentHtml: data.contentHtml ? data.contentHtml : null,
        okText: data.okText ? data.okText : '好的',
        ok: data.ok ? data.ok : function () {}
      }
    } else {
      state.globalAlert = {
        shown: true,
        title: '标题',
        content: '弹窗内容',
        contentHtml: null,
        okText: '好的',
        ok: function () {}
      }
    }
    store.vms['globalAlert'].openDialog('globalAlert')
  },
  [types.OPEN_CONFIRM] (state, data) {
    if (data) {
      state.globalConfirm = {
        shown: true,
        title: data.title ? data.title : '确认',
        content: data.content ? data.content : '是否确认？',
        contentHtml: data.contentHtml ? data.contentHtml : null,
        okText: data.okText ? data.okText : '确认',
        cancelText: data.cancelText ? data.cancelText : '取消',
        ok: data.ok ? data.ok : function () {},
        cancel: data.cancel ? data.cancel : function () {}
      }
    } else {
      state.globalConfirm = {
        shown: true,
        title: '确认',
        content: '是否确认？',
        contentHtml: null,
        okText: '确认',
        cancelText: '取消',
        ok: function () {},
        cancel: function () {}
      }
    }
    store.vms['globalConfirm'].openDialog('globalConfirm')
  },
  [types.OPEN_PROMPT] (state, data) {
    if (data) {
      state.globalPrompt = {
        shown: true,
        title: data.title ? data.title : '标题',
        content: data.content ? data.content : '',
        contentHtml: data.contentHtml ? data.contentHtml : null,
        inputId: data.inputId ? data.inputId : null,
        inputName: data.inputName ? data.inputName : null,
        inputMaxLength: data.inputMaxLength ? data.inputMaxLength : null,
        inputPlaceholder: data.inputPlaceholder ? data.inputPlaceholder : null,
        inputModel: data.inputModel ? data.inputModel : '',
        okText: data.okText ? data.okText : '确认',
        cancelText: data.cancelText ? data.cancelText : '取消',
        ok: data.ok ? data.ok : function () {},
        cancel: data.cancel ? data.cancel : function () {},
        opened: data.opened ? data.opened : function () {},
        closed: data.closed ? data.closed : function () {}
      }
    } else {
      state.globalPrompt = {
        shown: true,
        title: '标题',
        content: '',
        contentHtml: null,
        inputId: null,
        inputName: null,
        inputMaxLength: null,
        inputPlaceholder: null,
        inputModel: '',
        okText: '确认',
        cancelText: '取消',
        ok: function () {},
        cancel: function () {},
        opened: function () {},
        closed: function () {}
      }
    }
    store.vms['globalPrompt'].openDialog('globalPrompt')
  },
  [types.OPEN_LOADING] (state, data) {
    state.globalLoading = {
      shown: true,
      text: data && data.text ? data.text : ''
    }
    store.dispatch('contentBlur')
  },
  [types.CLOSE_LOADING] (state) {
    state.globalLoading = {
      shown: false,
      text: ''
    }
    store.dispatch('contentFocus')
  }
  // ,
  // [types.CONTENT_BLUR] () {
  //   const tabContent = document.querySelector('.md-tabs-content')
  //   !tabContent.classList.contains('blur') && tabContent.classList.add('blur')
  // },
  // [types.CONTENT_FOCUS] () {
  //   const tabContent = document.querySelector('.md-tabs-content')
  //   tabContent.classList.contains('blur') && tabContent.classList.remove('blur')
  // }
}
