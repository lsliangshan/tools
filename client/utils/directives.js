/**
 * Created by liangshan on 2017/6/24.
 */
import Vue from 'vue'
Vue.directive('timeFormat', {
  inserted: function (el, binding, vnode) {
    let _format = (vnode.elm.dataset.hasOwnProperty('format') ? vnode.elm.dataset.format.toLowerCase() : '')
    let _value = vnode.elm.dataset.value
    if (!isNaN(_value) && _value.length === 13) {
      const _date = new Date(Number(_value))
      const _year = _date.getFullYear()
      const _month = _date.getMonth()
      const _day = _date.getDate()
      const _hour = _date.getHours()
      const _minute = _date.getMinutes()
      const _second = _date.getSeconds()

      const _now = new Date()
      const _nowYear = _now.getFullYear()
      const _nowMonth = _now.getMonth()
      const _nowDay = _now.getDate()
      if (!_format) {
        if (_year < _nowYear) {
          _format = _year +
            '-' + (_month + 1 < 10 ? ('0' + (_month + 1)) : (_month + 1)) +
            '-' + (_day < 10 ? ('0' + _day) : _day) +
            ' ' + (_hour < 10 ? ('0' + _hour) : _hour) +
            ':' + (_minute < 10 ? ('0' + _minute) : _minute) +
            ':' + (_second < 10 ? ('0' + _second) : _second)
        } else if (_month < _nowMonth || (_month === _nowMonth && _day < _nowDay - 2)) {
          _format = (_month + 1 < 10 ? ('0' + (_month + 1)) : (_month + 1)) +
            '-' + (_day < 10 ? ('0' + _day) : _day) +
            ' ' + (_hour < 10 ? ('0' + _hour) : _hour) +
            ':' + (_minute < 10 ? ('0' + _minute) : _minute) +
            ':' + (_second < 10 ? ('0' + _second) : _second)
        } else if (_day === _nowDay - 2) {
          // 前天
          _format = '前天' +
            ' ' + (_hour < 10 ? ('0' + _hour) : _hour) +
            ':' + (_minute < 10 ? ('0' + _minute) : _minute) +
            ':' + (_second < 10 ? ('0' + _second) : _second)
        } else if (_day === _nowDay - 1) {
          // 昨天
          _format = '昨天' +
            ' ' + (_hour < 10 ? ('0' + _hour) : _hour) +
            ':' + (_minute < 10 ? ('0' + _minute) : _minute) +
            ':' + (_second < 10 ? ('0' + _second) : _second)
        } else if (_day === _nowDay) {
          // 今天
          _format = (_hour < 10 ? ('0' + _hour) : _hour) +
            ':' + (_minute < 10 ? ('0' + _minute) : _minute) +
            ':' + (_second < 10 ? ('0' + _second) : _second)
        }
      } else {
        _format = _format.replace(/yyyy/, _year + '')
          .replace(/mm/, (_month + 1) < 10 ? ('0' + (_month + 1)) : ((_month + 1) + ''))
          .replace(/dd/, (_day < 10 ? ('0' + _day) : (_day + '')))
          .replace(/h/, (_hour < 10 ? ('0' + _hour) : (_hour + '')))
          .replace(/m/, (_minute < 10 ? ('0' + _minute) : (_minute + '')))
          .replace(/s/, (_second < 10 ? ('0' + _second) : (_second + '')))
      }
      el.innerText = _format
    } else {
      el.innerText = _value
    }
  }
})
