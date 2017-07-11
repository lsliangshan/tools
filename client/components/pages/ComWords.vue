<template>
  <md-tab md-label="words" :md-active="defaultActive" class="words-container" md-tooltip="words" ref="words">
    <!--<img crossOrigin="" id="target" src="http://static.dei2.com/imgs/default.jpg">-->
    <md-button md-theme="teal" class="md-raised md-primary" @click.native="test">保存</md-button>

    <md-button md-theme="teal" class="md-fab md-primary md-fab-bottom-right zi99999" @click.native="showWordForm">
      <md-icon>edit</md-icon>
      <md-tooltip md-direction="left">我也要发一个</md-tooltip>
    </md-button>

    <transition name="letter-form-transition"
                @before-enter="wordsFormBeforeEnter"
                @enter="wordsFormEnter"
                @after-enter="wordsFormAfterEnter"
                @before-leave="wordsFormBeforeLeave"
                @leave="wordsFormLeave"
                @after-leave="wordsFormAfterLeave"
                v-bind:css="false">
      <div class="words-form-container" v-if="wordFormShown" @click.self="hideWordForm">
        <div class="words-form">
          <div class="words-form-header">
            <p>新建Letter</p>
            <p class="close" @click="hideWordForm">×</p>
          </div>
          <div class="words-form-body">
            <form novalidate>
              <div class="words-image">
                <span>图片</span>
                <div class="image">
                  <img class="preview-image" :src="wordFormInfo.image" onerror="this.src='http://static.dei2.com/imgs/favicon.ico'" alt="">
                  <input type="file" :data-accept="uploadFileInfo.accept" :data-max-size="uploadFileInfo.maxSize" v-upload-file>
                </div>
              </div>
              <md-input-container md-clearable>
                <label>标题</label>
                <md-input v-model="wordFormInfo.title"></md-input>
              </md-input-container>
              <md-input-container>
                <label>描述</label>
                <md-textarea maxlength="70" style="max-height: 70px;" v-model="wordFormInfo.content"></md-textarea>
              </md-input-container>
            </form>
          </div>
          <div class="words-form-footer">
            <md-button md-theme="teal" class="md-raised md-primary" @click.native="saveWord">保存</md-button>
            <md-button md-theme="red" class="md-primary" @click.native="hideWordForm">取消</md-button>
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
        activeIndex: -1,
        wordFormShown: false,
        wordFormInfo: {
          title: '',
          content: '',
          image: ''
        },
        uploadFileInfo: {
          accept: 'jpg|png|jpeg|gif',
          maxSize: 2 * 1024 * 1024
        }
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
      hideWordForm () {
        this.wordFormShown = false
      },
      showWordForm () {
        this.wordFormShown = true
      },
      test () {
        this.getBase64Image('http://static.dei2.com/imgs/default.jpg').then(function (result) {
          console.log('...++++...', result)
        })
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

          return new Promise(function (resolve, reject) {
            resolve(dataURL)
          })
        } else {
          let _img = new Image()
          _img.src = img
          return new Promise(function (resolve, reject) {
            _img.onload = function () {
              canvas.width = _img.width
              canvas.height = _img.height
              ctx.drawImage(_img, 0, 0, _img.width, _img.height)
              dataURL = canvas.toDataURL('image/png')
              resolve(dataURL)
            }
          })
        }
      },
      wordsFormBeforeEnter (el) {
        el.style.opacity = 0
      },
      wordsFormEnter (el, done) {
        const _w = $(window).width()
        const _h = $(window).height()
        let _wordForm = el.querySelector('.words-form')
        Velocity(el, {
          opacity: 1
        }, {
          duration: 300
        })
        Velocity(_wordForm, {
          translateX: (_w / 2 - 50),
          translateY: (_h / 2 - 50),
          translateZ: 0,
          scale: 0,
          opacity: 0
        }, {
          duration: 10
        })
        Velocity(_wordForm, {
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
      wordsFormAfterEnter (el) {

      },
      wordsFormBeforeLeave (el) {

      },
      wordsFormLeave (el, done) {
        const _w = $(window).width()
        const _h = $(window).height()
        let _wordForm = el.querySelector('.words-form')
        Velocity(el, {
          opacity: 0
        }, {
          duration: 200
        })
        Velocity(_wordForm, {
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
      wordsFormAfterLeave (el) {

      }
//      ,
//      uploadImage (target) {
//        console.log('.... upload image: ', target)
//      }
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
      },
      'uploadFile': {
        inserted: function (el, binding, vnode) {
          el.addEventListener('change', function (evt) {
            let _dataset = evt.target.dataset
            let acceptTypes = _dataset.hasOwnProperty('accept') ? _dataset.accept.split('|') : []
            if (evt.target.files.length > 0) {
              let _file = evt.target.files[0]
              if (acceptTypes.indexOf(_file.type.replace(/image\//, '')) === -1) {
                // 上传文件类型不合法
                // 清空file
//                evt.target.value = ''
                vnode.context.$store.commit('INSERT_TIP', {
                  type: 'error',
                  message: '文件类型不合法，只接收' + _dataset.accept,
                  cancel: false,
                  duration: 3000,
                  animationIn: 'fadeIn',
                  animationOut: 'fadeOut'
                })
              } else {
                // 上传文件类型合法
                let _acceptSize = _dataset.hasOwnProperty('maxSize') ? _dataset.maxSize : (2 * 1024 * 1024)
                if (Number(_file.size) > Number(_acceptSize)) {
                  // 上传文件大小，默认 2 * 1024 * 1024
                  vnode.context.$store.commit('INSERT_TIP', {
                    type: 'error',
                    message: '文件应小于' + (parseFloat(_dataset.maxSize)/1024/1024).toFixed(2) + 'M',
                    cancel: false,
                    duration: 10000,
                    animationIn: 'fadeIn',
                    animationOut: 'fadeOut'
                  })
                } else {
                  // 上传文件合法
                  var formData = new FormData();
                  formData.append('file', _file)
//                  let httprequest = new XMLHttpRequest()
//                  XMLHttpRequest.onreadystatechange = function () {
//                    console.log(httprequest.responseText)
//                  }
//                  httprequest.open('POST', vnode.context.$store.state.requestUrl + '/index/uploadImage')
//                  httprequest.send(formData)

                  $.ajax({
                    type: 'POST',
                    url: vnode.context.$store.state.requestUrl + '/index/uploadImage',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                      console.log('上传成功: ', res)
                    },
                    error: function (err) {
                      console.log('上传失败：', err)
                    }
                  })

//                  $.ajax({
//                    async: false,
//                    url: vnode.context.$store.state.requestUrl + '/index/uploadImage',
//                    method: 'post',
//                    data: {
//                      file: _file
//                    },
//                    dataType: 'json',
//                    success: function (res) {
//                      if (Number(res.code) === 200) {
//                        console.log('文件上传', res)
//                      }
//                    }
//                  })

                }
              }
            }
          }, false)
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
  }

  .words-form-container {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 9999;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    .words-form {
      width: 500px;
      min-height: 400px;
      border-radius: 5px;
      overflow: hidden;
      background-color: #ffffff;
      .words-form-header {
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
      .words-form-body {
        width: 100%;
        height: 304px;
        padding: 15px;
        .words-image {
          width: 100%;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          span {
            width: 40px;
            color: #666;
          }
          .image {
            width: 64px;
            height: 64px;
            border: 1px solid #e5e5e5;
            position: relative;
            .preview-image {
              pointer-events: none;
              max-width: 100%;
              max-height: 100%;
            }
            input[type='file'] {
              position: absolute;
              top: 0;
              width: 64px;
              height: 64px;
              opacity: 0;
              cursor: pointer;
            }
          }
        }
      }
      .words-form-footer {
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
</style>
