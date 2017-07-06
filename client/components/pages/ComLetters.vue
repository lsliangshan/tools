<template>
  <md-tab md-label="letters" class="letters-container" md-tooltip="letters">
    <div class="letter-item" v-for="(item, index) in letters" :key="item" v-ls-init>
      <div class="letter-header"></div>
      <div class="letter-logo">
        <img :src="item.logo" onerror="this.src='http://static.dei2.com/imgs/default.jpg'">
      </div>
      <div class="letter-title" :title="item.title">
        <span v-text="item.title"></span>
      </div>
      <div class="letter-content">
        <span v-text="item.content"></span>
      </div>
      <div class="letter-time">
        <span data-format="YYYY年MM月DD日 H:m:s" :data-value="item.time" v-time-format></span>
      </div>
    </div>
  </md-tab>
</template>

<script>
  import * as types from '../../store/mutation-types'

  export default {
    data () {
      return {
        letters: []
      }
    },
    computed: {
      theme () {
        return this.$store.state.theme
      }
    },
    created () {
      for (var i = 0; i < 50; i++) {
        this.letters.push({
          logo: 'http://static.dei2.com/imgs/default.jpg',
          title: '这是标题' + (i + 1),
          content: (i + 1) + '习近平指出，中韩地理相近、文化相通，互补优势明显。建交25年来，中韩双方秉持建交联合公报精神，本着相互理解、相互尊重原则，推动中韩关系实现跨越式发展，给两国和两国人民带来巨大福祉，也为地区和平稳定繁荣作出了重要贡献。',
          time: +new Date()
        })
      }
    },
    methods: {
      dragBefore (event, ui) {
        event.target.style.webkitTransition = ''
        event.target.style.mozTransition = ''
        event.target.style.oTransition = ''
        event.target.style.transition = ''
      },
      dragAfter (event, ui) {
        let _w = $(window).width()
        if (ui.offset.left <= _w / 2) {
          event.target.style.left = 0
        } else if (ui.offset.left > _w / 2) {
          event.target.style.left = (_w - 48) + 'px'
        }
        event.target.style.webkitTransition = 'all .3s cubic-bezier(0.215,.61,.355,1)'
        event.target.style.mozTransition = 'all .3s cubic-bezier(0.215,.61,.355,1)'
        event.target.style.oTransition = 'all .3s cubic-bezier(0.215,.61,.355,1)'
        event.target.style.transition = 'all .3s cubic-bezier(0.215,.61,.355,1)'
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
            setTimeout(function () {
              el.classList.contains('init-transition') && el.classList.remove('init-transition')

              $(el).draggable({
                start: vnode.context[vnode.elm.dataset.before] || function () {},
                stop: vnode.context[vnode.elm.dataset.after] || function () {},
                containment: [-10, -100, _w - 38, _h - 200]
              })

              el.addEventListener('click', function (evt) {
                !el.classList.contains('init-transition-p4') && el.classList.add('init-transition-p4')
                !this.classList.contains('active') && this.classList.add('active')
                this.style.left = (_w - 250) / 2 + 'px'
                this.style.top = (_h - 500) / 2 + 'px'
              }, false)
            }, 1000)
            clearTimeout(_initTimeout)
          }, _randomTime)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .letters-container {
    width: 100%;
    height: 100%;
    padding: 0;
    .letter-item {
      position: absolute;
      left: calc(50% - 125px);
      /*top: 100px;*/
      width: 250px;
      background-color: #ffffff;
      border-radius: 5px;
      cursor: move;
      overflow: hidden;
      -webkit-box-shadow: 2px 1px 5px 1px rgba(0, 0, 0, 0.2);
      -moz-box-shadow: 2px 1px 5px 1px rgba(0, 0, 0, 0.2);
      box-shadow: 2px 1px 5px 1px rgba(0, 0, 0, 0.2);
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
      &.init-transition {
        -webkit-transition: all 1s ease-in-out;
        -moz-transition: all 1s ease-in-out;
        -o-transition: all 1s ease-in-out;
        transition: all 1s ease-in-out;
      }
      &.init-transition-p4 {
        -webkit-transition: all .4s ease-in-out;
        -moz-transition: all .4s ease-in-out;
        -o-transition: all .4s ease-in-out;
        transition: all .4s ease-in-out;
      }
      &.active {
        -webkit-transform: rotate(0deg)!important;
        -moz-transform: rotate(0deg)!important;
        -o-transform: rotate(0deg)!important;
        transform: rotate(0deg)!important;
      }
      .letter-header {
        width: 100%;
        height: 10px;
        background-color: #424242;
      }
      .letter-logo {
        width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 150px;
          height: 150px;
          border: 1px solid #f5f5f5;
          border-radius: 5px;
        }
      }
      .letter-title {
        width: 100%;
        height: 30px;
        line-height: 30px;
        padding: 0 8px;
        font-weight: bold;
        color: #666;
        font-size: 14px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-wrap: break-word;
      }
      .letter-content {
        width: 100%;
        line-height: 1.5;
        padding: 8px;
        font-weight: normal;
        font-size: 12px;
        color: #797979;
        text-shadow: 0 1px 10px #f5f5f5;
      }
      .letter-time {
        width: 100%;
        height: 30px;
        line-height: 30px;
        padding: 0 8px;
        font-size: 12px;
        color: #797979;
        text-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
        text-align: right;
      }
    }
  }
</style>
