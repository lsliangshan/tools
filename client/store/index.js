import Vue from 'vue'
import Vuex from 'vuex'
// import router from '../router'
import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
import * as utils from '../utils/index'

const pkg = require('../../package')
Vue.use(Vuex)

const noop = function () {}

const state = {
  appName: pkg.name,
  theme: 'black',
  musicBoxAnimationId: 0,
  requestUrl: 'https://talkapi.dei2.com',
  // requestUrl: 'http://127.0.0.1:3002',
  showMask: false,
  globalTips: {},
  globalDialog: {
    shown: false,
    title: '提示框',
    content: '提示内容',
    contentHtml: '',
    okText: '确认',
    cancelText: '取消',
    ok: noop,
    cancel: noop,
    opened: noop,
    closed: noop
  },
  globalAlert: {
    shown: false,
    title: '标题',
    content: '弹窗内容',
    contentHtml: '',
    okText: '好的',
    ok: noop,
    opened: noop,
    closed: noop
  },
  globalConfirm: {
    shown: false,
    title: '确认',
    content: '是否确认？',
    contentHtml: '',
    okText: '确认',
    cancelText: '取消',
    ok: noop,
    cancel: noop,
    opened: noop
  },
  globalPrompt: {
    shown: false,
    title: '标题',
    content: '',
    contentHtml: '',
    inputId: '',
    inputName: '',
    inputMaxLength: '',
    inputPlaceholder: '',
    inputModel: '',
    okText: '确认',
    cancelText: '取消',
    ok: noop,
    cancel: noop,
    opened: noop,
    closed: noop
  },
  globalLoading: {
    shown: false,
    text: ''
  }
}
// utils.ajax({
//   url: 'http://counter.sina.com.cn/ip',
//   methods: 'GET',
//   success: function (res) {
//     console.log('>>>>>>', res)
//   }
// })

const store = new Vuex.Store({
  state,
  mutations: mutations.mutations,
  actions,
  getters
})

export default store

window.STORE = this
window.STATE = state
