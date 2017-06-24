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
 * Created by liangshan on 2017/5/31.
 */

(function () {
  var lastTime = 0
  var vendors = ['webkit', 'moz']
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
      window[vendors[x] + 'CancelRequestAnimationFrame']
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime()
      var timeToCall = Math.max(0, 16.7 - (currTime - lastTime))
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id)
    }
  }
}())

function bin2hex (s) {
  let i
  let l
  let o = ''
  let n
  s += ''
  for (i = 0, l = s.length; i < l; i++) {
    n = s.charCodeAt(i).toString(16)
    o += n.length < 2 ? '0' + n : n
  }
  return o
}

export function getUUID (prefix) {
  /**
   * 生成UUID
   * @param {txt}
   * @return String
   */
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'top'
  ctx.font = '14px "Arial"'
  ctx.textBaseline = 'zhaopin'
  ctx.fillStyle = '#f60'
  ctx.fillRect(125, 1, 62, 20)
  ctx.fillStyle = '#069'
  ctx.fillText(prefix, 2, 15)
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
  ctx.fillText(prefix, 4, 17)

  const b64 = canvas.toDataURL().replace('data:image/png;base64,', '')
  const bin = window.atob(b64)
  const crc = bin2hex(bin.slice(-16, -12))
  return crc
}

function formatParams (data) {
  var arr = []
  for (var name in data) {
    if (data.hasOwnProperty(name)) {
      arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))
    }
  }
  arr.push(('v=' + Math.random()).replace('.', ''))
  return arr.join('&')
}
/**
 * js原生AJAX请求
 * @param opts
 */
export function ajax (opts) {
  opts = opts || {}
  opts.method = (opts.method || 'GET').toUpperCase()
  opts.dataType = opts.dataType || 'json'
  var params = formatParams(opts.data)

  var xhr
  if (window.XMLHttpRequest) {
    // 创建 非IE6
    xhr = new window.XMLHttpRequest()
  } else {
    // 创建 IE6及其以下版本
    xhr = new window.ActiveXObject('Microsoft.XMLHTTP')
  }

  // 连接http，发送数据
  if (opts.method === 'GET') {
    xhr.open('GET', opts.url + '?' + params, true)
    xhr.send(null)
  } else if (opts.method === 'POST') {
    xhr.open('POST', opts.url, true)
    // 设置表单提交时的内容类型
    xhr.setRequestHeader('Content-Type', 'application/x-ww-form-urlencoded')
    xhr.send(params)
  }

  // 接收返回数据
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var status = xhr.status
      if (status >= 200 && status < 300) {
        opts.success && opts.success(xhr.responseText, xhr.responseXML)
      } else {
        opts.fail && opts.fail(status)
      }
    }
  }
}

