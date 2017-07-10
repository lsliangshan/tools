<template>
  <md-tab md-label="words" :md-active="defaultActive" class="words-container" md-tooltip="words" ref="words">
    <md-button md-theme="teal" class="md-raised md-primary" @click.native="test">保存</md-button>
  </md-tab>
</template>

<script>
  import * as types from '../../store/mutation-types'
  import Velocity from 'velocity-animate'

  export default {
    data () {
      return {
        activeIndex: -1
      }
    },
    computed: {
      theme () {
        return this.$store.state.theme
      },
      defaultActive () {
        return (this.$route.hash.substring(1).toLowerCase() === 'words')
      }
    },
    created () {
    },
    methods: {
      test () {
        console.log('。。。。', this.getBase64Image('http://static.dei2.com/imgs/default.jpg'))
      },
      getBase64Image (img) {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let dataURL
        if (img instanceof HTMLElement) {
          canvas.width = img.width
          canvas.height = img.height

          ctx.drawImage(img, 0, 0, img.width, img.height)

          dataURL = canvas.toDataURL('image/png')

          return dataURL
        } else {
          let _img = document.createElement('img') // new Image()
          _img.src = img
//          _img.setAttribute('crossOrigin', 'anonymous')
          _img.crossOrigin = 'anonymous'
          _img.onload = function () {
            console.log('.>>>>', img)
            canvas.width = _img.width
            canvas.height = _img.height
            ctx.drawImage(_img, 0, 0, _img.width, _img.height)
            dataURL = canvas.toDataURL('image/png')

            return dataURL
          }
        }
      }
    },
    directives: {
      'lsDrag': {
        inserted: function (el, binding, vnode) {
          let _w = $(window).width()
          let _h = $(window).height()
          $(el).draggable({
            start: vnode.context[vnode.elm.dataset.before] || function () {},
            stop: vnode.context[vnode.elm.dataset.after] || function () {},
            containment: [-10, 48, _w - 38, _h - 48]
          })
        }
      },
      'lsInit': {
        inserted: function (el, binding, vnode) {
          let _w = $(window).width()
          let _h = $(window).height()
          let _randomTime = Math.floor(Math.random() * 2000)
          let _randomAngle = Math.floor(Math.random() * 10) - 10
          let _randomX = _w - Math.floor(Math.random() * _w)
          let _randomY = _h - Math.floor(Math.random() * _h)

          let _selfBox = el.getBoundingClientRect()
          el.style.top = (_h - 48 - _selfBox.height) / 2 + 'px'

          !el.classList.contains('init-transition') && el.classList.add('init-transition')
          let _initTimeout = setTimeout(function () {
            el.style.webkitTransform = 'rotate(' + _randomAngle + 'deg)'
            el.style.mozTransform = 'rotate(' + _randomAngle + 'deg)'
            el.style.oTransform = 'rotate(' + _randomAngle + 'deg)'
            el.style.transform = 'rotate(' + _randomAngle + 'deg)'
            el.style.left = _randomX + 'px'
            el.style.top = _randomY + 'px'
            el.setAttribute('data-origin-left', _randomX)
            el.setAttribute('data-origin-top', _randomY)
            setTimeout(function () {
              el.classList.contains('init-transition') && el.classList.remove('init-transition')

              $(el).draggable({
                start: vnode.context[vnode.elm.dataset.before] || function () {},
                stop: vnode.context[vnode.elm.dataset.after] || function () {},
                scrollSpeed: 2,
                containment: [-10, -100, _w - 38, _h - 200]
              })

//              el.addEventListener('click', function (evt) {
//                !this.classList.contains('init-transition-p4') && this.classList.add('init-transition-p4')
//                vnode.context.activeIndex = Number(vnode.elm.dataset.index)
//                this.style.left = (_w - 250) / 2 + 'px'
//                this.style.top = (_h - 500) / 2 + 'px'
//
//                setTimeout(function () {
//
//                }, 400)
//              }, false)
            }, 1000)
            clearTimeout(_initTimeout)
          }, _randomTime)
        }
      },
      'lsText': {
        inserted: function (el, binding, vnode) {
          let _img = document.createElement('img')
          _img.src = 'http://static.dei2.com/imgs/mask2.gif'
          _img.style.width = '120px'
          _img.style.height = '120px'
          _img.style.position = 'relative'
          _img.style.left = '65px'
          el.appendChild(_img)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .zi99999 {
    z-index: 99999;
  }
  .words-container {
    width: 100%;
    height: 100%;
    padding: 0;
    position: relative;
  }
</style>
