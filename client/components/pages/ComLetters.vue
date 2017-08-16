<template>
  <md-tab md-label="letters" :md-active="defaultActive" class="letters-container" md-tooltip="letters" ref="letters">
    <transition name="letter-mask-transition" enter-active-class="animated-p3 fadeIn" leave-active-class="animated-p3 fadeOut">
      <div class="letter-mask" v-if="activeIndex!=-1" @click="resetActiveIndex"></div>
    </transition>
    <div class="letter-item init-transition-p3" v-for="(item, index) in letters" :key="item" :class="activeIndex==index?'active':(activeIndex!=-1&&activeIndex!=index?'blur':'')" :data-index="index" @click="handleClick($event)" data-before="dragBefore" data-after="dragAfter" v-ls-init>
      <div class="letter-header"></div>
      <div class="letter-logo">
        <img :src="item.image" onerror="this.src='https://static.dei2.com/imgs/default.jpg'">
      </div>
      <div class="letter-title" :title="item.title">
        <span v-text="item.title"></span>
      </div>
      <div class="letter-content" v-text="item.content">

      </div>
      <div class="letter-time">
        <span data-format="YYYY年MM月DD日 H:m:s" :data-value="item.update_time*1000" v-time-format></span>
      </div>
    </div>

    <md-button md-theme="teal" class="md-fab md-primary md-fab-bottom-right zi99999" @click.native="showLetterForm">
      <md-icon>edit</md-icon>
      <md-tooltip md-direction="left">我也要发一个</md-tooltip>
    </md-button>

    <transition name="letter-form-transition"
      @before-enter="letterFormBeforeEnter"
      @enter="letterFormEnter"
      @after-enter="letterFormAfterEnter"
      @before-leave="letterFormBeforeLeave"
      @leave="letterFormLeave"
      @after-leave="letterFormAfterLeave"
                v-bind:css="false">
      <div class="letter-form-container" v-if="letterFormShown" @click.self="hideLetterForm">
        <div class="letter-form">
          <div class="letter-form-header">
            <p>新建Letter</p>
            <p class="close" @click="hideLetterForm">×</p>
          </div>
          <div class="letter-form-body">
            <form novalidate>
              <div class="letter-image">
                <span>图片</span>
                <div class="image">
                  <img class="preview-image" :src="letterFormInfo.image" onerror="this.src='https://static.dei2.com/imgs/favicon.ico'" alt="">
                  <com-upload
                          :style="uploadComStyle"
                          class="test"
                          name="file"
                          data-accept="jpg|jpeg|png|gif"
                          :data-max-size="2*1024*1024"
                          :data-action="requestUrl + '/index/uploadImage'"
                          :data-body="{'age': 10}"
                          :data-preview="true"
                          :data-progress="true"
                          @preview="uploadFilePreview"
                          @beforeSend="uploadFileBeforeSend"
                          @progress="uploadFileProgress"
                          @success="uploadFileSuccess"
                          @error="uploadFileError"
                  ></com-upload>
                </div>
              </div>
              <md-input-container md-clearable>
                <label>标题</label>
                <md-input v-model="letterFormInfo.title"></md-input>
              </md-input-container>
              <md-input-container>
                <label>描述</label>
                <md-textarea maxlength="70" style="max-height: 70px;" v-model="letterFormInfo.content"></md-textarea>
              </md-input-container>
            </form>
          </div>
          <div class="letter-form-footer">
            <md-button md-theme="teal" class="md-raised md-primary" @click.native="saveLetter">保存</md-button>
            <md-button md-theme="red" class="md-primary" @click.native="hideLetterForm">取消</md-button>
          </div>
        </div>
      </div>
    </transition>
  </md-tab>
</template>

<script>
  import * as types from '../../store/mutation-types'
  import Velocity from 'velocity-animate'

  export default {
    data () {
      return {
        letters: [],
        activeIndex: -1,
        letterFormShown: false,
        letterFormInfo: {
          title: '',
          content: '',
          image: ''
        },
        uploadFileInfo: {
          accept: 'jpg|png|jpeg|gif',
          maxSize: 2 * 1024 * 1024
        },
        requestUrl: this.$store.state.requestUrl,
        uploadComStyle: {
          color: '#ee3333',
          fontSize: '16px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          wordWrap: 'break-word'
        },
        refuseHideLetterForm: ''
      }
    },
    computed: {
      theme () {
        return this.$store.state.theme
      },
      defaultActive () {
        return (this.$route.hash.substring(1).toLowerCase() === 'letters')
      }
    },
    created () {
//      for (var i = 0; i < 1; i++) {
//        this.letters.push({
//          logo: 'http://static.dei2.com/imgs/favicon.ico',
//          title: '这是标题' + (i + 1),
//          content: (i + 1) + '习近平指出，中韩地理相近、文化相通，互补优势明显。建交25年来，中韩双方秉持建交联合公报精神，本着相互理解、相互尊重原则，推动中韩关系实现跨越式发展，给两国和两国人民带来巨大福祉，也为地区和平稳定繁荣作出了重要贡献。',
//          time: +new Date()
//        })
//      }
      const that = this
//      $.ajax({
//        async: false,
//        url: that.$store.state.requestUrl + '/index/getLetters',
//        dataType: 'jsonp',
//        success: function (res) {
//          if (Number(res.code) === 200) {
//            that.letters = res.data
//          }
//        }
//      })
      $.post({
        url: that.$store.state.requestUrl + '/index/getLetters',
        success: function (res) {
          if (Number(res.code) === 200) {
            that.letters = res.data
          }
        }
      })
    },
    methods: {
      saveLetter () {
        const that = this
//        $.ajax({
//          async: false,
//          url: that.$store.state.requestUrl + '/index/saveLetter',
//          data: {
//            title: this.letterFormInfo.title,
//            content: this.letterFormInfo.content,
//            image: this.letterFormInfo.image
//          },
//          dataType: 'post',
//          success: function (res) {
//            if (Number(res.code) === 200) {
//              that.letters.push(res.data)
//              that.letterFormInfo = {
//                title: '',
//                content: '',
//                image: ''
//              }
//              that.hideLetterForm()
//            }
//          }
//        })
        $.post({
          url: that.$store.state.requestUrl + '/index/saveLetter',
          data: {
            title: this.letterFormInfo.title,
            content: this.letterFormInfo.content,
            image: this.letterFormInfo.image
          },
          success: function (res) {
            if (Number(res.code) === 200) {
              that.letters.push(res.data)
              that.letterFormInfo = {
                title: '',
                content: '',
                image: ''
              }
              that.hideLetterForm()
            }
          }
        })
      },
      uploadFilePreview (file) {

      },
      uploadFileBeforeSend (xhr) {
//        console.log('before send: ', xhr)
        this.refuseHideLetterForm = '正在上传中...'
      },
      uploadFileProgress (evt) {
//        if (evt.lengthComputable) {
//          console.log('progress ...', evt.total, evt.loaded)
//        }
      },
      uploadFileSuccess (evt) {
//        console.log('success ...', evt)
        this.refuseHideLetterForm = ''
        this.letterFormInfo.image = evt.path
      },
      uploadFileError (err) {
//        console.log('error', err)
        this.refuseHideLetterForm = ''
      },
      hideLetterForm () {
        if (this.refuseHideLetterForm.trim() !== '') {
          this.$store.commit('INSERT_TIP', {
            type: 'info',
            message: this.refuseHideLetterForm.trim(),
            cancel: false,
            duration: 2000,
            animationIn: 'fadeIn',
            animationOut: 'fadeOut'
          })
        } else {
          this.letterFormShown = false
        }
      },
      showLetterForm () {
        this.letterFormShown = true
      },
      resetActiveIndex () {
        let _activeItem = this.$refs.letters.$el.querySelectorAll('.letter-item')[this.activeIndex]
        _activeItem.style.left = _activeItem.getAttribute('data-origin-left') + 'px'
        _activeItem.style.top = _activeItem.getAttribute('data-origin-top') + 'px'
        this.activeIndex = -1
      },
      dragBefore (event, ui) {
        !event.target.classList.contains('ls-dragging') && event.target.classList.add('ls-dragging')
        event.target.classList.contains('init-transition-p3') && event.target.classList.remove('init-transition-p3')
      },
      dragAfter (event, ui) {
        !event.target.classList.contains('init-transition-p3') && event.target.classList.add('init-transition-p3')
        event.target.setAttribute('data-origin-left', ui.position.left)
        event.target.setAttribute('data-origin-top', ui.position.top)
        setTimeout(function () {
          event.target.classList.contains('ls-dragging') && event.target.classList.remove('ls-dragging')
        }, 100)
      },
      handleClick (target) {
        if (!target.target.classList.contains('ls-dragging')) {
          let _self = target.target
          let _w = $(window).width()
          let _h = $(window).height()
          _self.style.left = (_w - 250) / 2 + 'px'
          _self.style.top = (_h - 500) / 2 + 'px'
          this.activeIndex = Number(_self.dataset.index)
        } else {
          target.preventDefault()
        }
      },
      letterFormBeforeEnter (el) {
        el.style.opacity = 0
      },
      letterFormEnter (el, done) {
        const _w = $(window).width()
        const _h = $(window).height()
        let _letterForm = el.querySelector('.letter-form')
        Velocity(el, {
          opacity: 1
        }, {
          duration: 300
        })
        Velocity(_letterForm, {
          translateX: (_w / 2 - 50),
          translateY: (_h / 2 - 50),
          translateZ: 0,
          scale: 0,
          opacity: 0
        }, {
          duration: 10
        })
        Velocity(_letterForm, {
          translateX: 0,
          translateY: 0,
          translateZ: 0,
          scale: 1,
          opacity: 1
        }, {
          easing: [0.215,.61,.355,1],
          duration: 400,
          done
        })
      },
      letterFormAfterEnter (el) {

      },
      letterFormBeforeLeave (el) {

      },
      letterFormLeave (el, done) {
        const _w = $(window).width()
        const _h = $(window).height()
        let _letterForm = el.querySelector('.letter-form')
        Velocity(el, {
          opacity: 0
        }, {
          duration: 200
        })
        Velocity(_letterForm, {
          translateX: (_w / 2 - 50),
          translateY: (_h / 2 - 50),
          translateZ: 0,
          scale: 0,
          opacity: 0
        }, {
          duration: 300,
          complete: done
        })
      },
      letterFormAfterLeave (el) {

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
          _img.src = 'https://static.dei2.com/imgs/mask2.gif'
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
  .letters-container {
    width: 100%;
    height: 100%;
    padding: 0;
    position: relative;
    overflow: auto;
    .letter-mask {
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: 998;
      background-color: rgba(0, 0, 0, 0.6);
    }
    .letter-item {
      position: absolute;
      left: calc(50% - 125px);
      /*top: 100px;*/
      width: 250px;
      background-color: #ffffff;
      border-radius: 5px;
      cursor: move;
      overflow: hidden;
      z-index: 997;
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
      &.init-transition-p3 {
        -webkit-transition: all .3s ease-in-out;
        -moz-transition: all .3s ease-in-out;
        -o-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;
      }
      &.blur {
        -webkit-filter: blur(8px);
        -ms-filter: blur(8px);
        filter: blur(8px);
      }
      &.active {
        position: absolute;
        z-index: 999;
        -webkit-transform: rotate(0deg)!important;
        -moz-transform: rotate(0deg)!important;
        -o-transform: rotate(0deg)!important;
        transform: rotate(0deg)!important;
      }
      .letter-header {
        width: 100%;
        height: 10px;
        pointer-events: none;
        background-color: #424242;
      }
      .letter-logo {
        width: 100%;
        height: 200px;
        pointer-events: none;
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
        pointer-events: none;
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
        pointer-events: none;
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
        pointer-events: none;
        text-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
        text-align: right;
      }
    }

    .letter-form-container {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      .letter-form {
        width: 500px;
        min-height: 400px;
        border-radius: 5px;
        overflow: hidden;
        background-color: #ffffff;
        .letter-form-header {
          position: relative;
          width: 100%;
          height: 48px;
          line-height: 48px;
          background-color: #424242;
          color: #ffffff;
          padding: 0 15px;
          font-size: 16px;
          .close {
            width: 48px;
            height: 48px;
            position: absolute;
            right: 0;
            line-height: 48px;
            top: 0;
            text-align: center;
            cursor: pointer;
            font-size: 24px;
            color: #999;
            &:hover {
              color: #eee;
            }
          }
        }
        .letter-form-body {
          width: 100%;
          height: 304px;
          padding: 15px;
          .letter-image {
            width: 100%;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            span {
              width: 40px;
              color: #666;
            }
            .image {
              position: relative;
              width: 96px;
              height: 96px;
              border: 1px solid #e5e5e5;
              input {
                width: 64px;
                height: 64px;
                opacity: 0;
                cursor: pointer;
              }
            }
          }
        }
        .letter-form-footer {
          position: relative;
          width: 100%;
          height: 48px;
          line-height: 48px;
          color: #ffffff;
          padding: 0 15px;
          background-color: #ffffff;
          button {
            float: right;
          }
        }
      }
    }
  }
</style>
