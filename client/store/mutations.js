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
  [types.SHOW_DIALOG] (state, data) {
    state.globalDialog = {
      shown: true,
      title: data.title || '提示框',
      content: data.content || '提示内容',
      okText: data.okText || '确认',
      cancelText: data.cancelText || '取消',
      ok: data.ok || function () {},
      cancel: data.cancel || function () {},
      from: data.from || '',
      to: data.to || ''
    }
  },
  [types.HIDE_DIALOG] (state) {
    state.globalDialog = {
      shown: false,
      title: '提示框',
      content: '提示内容',
      okText: '确认',
      cancelText: '取消',
      ok: function () {},
      cancel: function () {},
      from: '',
      to: ''
    }
  }
}
