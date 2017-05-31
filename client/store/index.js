import Vue from 'vue'
import Vuex from 'vuex'
// import router from '../router'
import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
const pkg = require('../../package')
Vue.use(Vuex)

const noop = function () {}

const state = {
  appName: pkg.name,
  theme: 'black',
  showMask: false,
  globalTips: {},
  globalDialog: {
    shown: false,
    title: '提示框',
    content: '提示内容',
    okText: '确认',
    cancelText: '取消',
    ok: noop,
    cancel: noop
  },
  globalAlert: {
    shown: false,
    title: '标题',
    content: '弹窗内容',
    okText: '好的',
    ok: noop
  }
}

const store = new Vuex.Store({
  state,
  mutations: mutations.mutations,
  actions,
  getters
})

export default store

window.STORE = this
window.STATE = state
