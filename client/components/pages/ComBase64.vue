<template>
  <md-tab md-label="base64" :md-active="defaultActive" class="base64-container" md-tooltip="base64加解密">
    <!--<p>-->
      <!--Base64是网络上最常见的用于传输8Bit字节代码的编码方式之一，大家可以查看RFC2045～RFC2049，上面有MIME的详细规范。Base64编码可用于在HTTP环境下传递较长的标识信息。例如，在Java Persistence系统Hibernate中，就采用了Base64来将一个较长的唯一标识符（一般为128-bit的UUID）编码为一个字符串，用作HTTP表单和HTTP GET URL中的参数。在其他应用程序中，也常常需要把二进制数据编码为适合放在URL（包括隐藏表单域）中的形式。此时，采用Base64编码具有不可读性，即所编码的数据不会被人用肉眼所直接看到。-->
    <!--</p>-->
    <p>请输入要进行编码或解码的字符：</p>
    <div class="wrapper" @mouseenter="showSrcCloseBtn" @mouseleave="hideSrcCloseBtn">
      <textarea class="base64-src" id="base64-src" v-model="srcStr" placeholder="请输入待编码内容"></textarea>
      <transition name="src-close-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="operations" v-if="availableSrcOperations">
          <div class="close operate" @click="removeSrc">
            <md-icon>close</md-icon>
            <md-tooltip md-direction="right">清空文本</md-tooltip>
          </div>
          <div data-clipboard-target="#base64-src" class="copy operate">
            <md-icon>content_copy</md-icon>
            <md-tooltip md-direction="right">复制文本</md-tooltip>
          </div>
        </div>
      </transition>
    </div>
    <div class="btns">
      <div @click="decode">
        <md-button class="md-raised md-primary" :md-theme="theme">解密</md-button>
      </div>
      <div @click="encode">
        <md-button class="md-raised md-accent" :md-theme="theme">加密</md-button>
      </div>
    </div>
    <p>Base64编码或解码结果：</p>
    <div class="wrapper" @mouseenter="showDestCloseBtn" @mouseleave="hideDestCloseBtn">
      <textarea class="base64-dest" id="base64-dest" v-model="destStr"></textarea>
      <transition name="dest-close-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="operations" v-if="availableDestOperations">
          <div class="close operate" @click="removeDest">
            <md-icon>close</md-icon>
            <md-tooltip md-direction="right">清空文本</md-tooltip>
          </div>
          <div data-clipboard-target="#base64-dest" class="copy operate">
            <md-icon>content_copy</md-icon>
            <md-tooltip md-direction="right">复制文本</md-tooltip>
          </div>
        </div>
      </transition>
    </div>
  </md-tab>
</template>

<script>
  import * as types from '../../store/mutation-types'
  const Base64 = require('js-base64').Base64
  const Clipboard = require('clipboard')
  export default {
    data () {
      return {
        srcStr: '',
        destStr: '',
        availableSrcOperations: false,
        availableDestOperations: false
      }
    },
    computed: {
      theme () {
        return this.$store.state.theme
      },
      defaultActive () {
        return (this.$route.hash.substring(1).toLowerCase() === 'base64')
      }
    },
    created () {
      const that = this
      const clipboard = new Clipboard('.copy', {})
      clipboard.on('success', function (e) {
        if (e.text.trim() !== '') {
          let _msg = ''
          if (e.action === 'copy') {
            _msg = '复制成功'
          } else if (e.action === 'cut') {
            _msg = '剪切成功'
          }
          that.$store.commit(types.INSERT_TIP, {
            message: _msg,
            cancel: false
          })
        }
      })
      clipboard.on('error', function (e) {
        if (e.text.trim() !== '') {
          let _msg = ''
          if (e.action === 'copy') {
            _msg = '复制失败'
          } else if (e.action === 'cut') {
            _msg = '剪切失败'
          }
          that.$store.commit(types.INSERT_TIP, {
            type: 'error',
            message: _msg,
            cancel: false
          })
        }
      })
    },
    methods: {
      encode () {
        this.destStr = Base64.encode(this.srcStr)
      },
      decode () {
        this.destStr = Base64.decode(this.srcStr)
      },
      removeSrc () {
        this.srcStr = ''
      },
      removeDest () {
        this.destStr = ''
      },
      showSrcCloseBtn () {
        this.availableSrcOperations = true
      },
      hideSrcCloseBtn () {
        this.availableSrcOperations = false
      },
      showDestCloseBtn () {
        this.availableDestOperations = true
      },
      hideDestCloseBtn () {
        this.availableDestOperations = false
      }
    }
  }
</script>

<style scoped lang="scss">
  .base64-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      /*font-size: 12px;*/
      color: #666;
      line-height: 40px;
    }
    .wrapper {
      position: relative;
      textarea {
        width: 600px;
        height: 120px;
        padding: 8px 30px 8px 8px;
      }
      .operations {
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
        .operate {
          position: relative;
          .md-icon {
            width: 18px;
            height: 18px;
            min-width: 18px;
            min-height: 18px;
            font-size: 18px;
            margin-bottom: 5px;
          }
        }
      }
    }
    .btns {
      padding: 20px;
      display: flex;
      align-items: center;
    }
  }
  .md-tooltip {
    margin-top: -10px!important;
  }
</style>
