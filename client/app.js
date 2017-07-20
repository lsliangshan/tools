import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './components/App'
import router from './router'
import store from './store'
import '../static/js/theme'
import 'utils/directives'
import 'utils/components'

sync(store, router)

const app = new Vue({
  router,
  store,
  ...App
})

export { app, router, store }

document.write('<script language="javascript" type="text/javascript" src="//js.users.51.la/19241858.js"></script>')
