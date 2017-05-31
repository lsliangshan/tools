import Vue from 'vue'
import Vuex from 'vuex'
// import router from '../router'
import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
const pkg = require('../../package')
Vue.use(Vuex)

const state = {
  appName: pkg.name,
  theme: 'black',
  showMask: false,
  globalTips: {}
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
