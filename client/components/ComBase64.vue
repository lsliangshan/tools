<template>
  <md-tab md-label="base64" class="base64-container" md-tooltip="base64加解密">
    <!--<p>-->
      <!--Base64是网络上最常见的用于传输8Bit字节代码的编码方式之一，大家可以查看RFC2045～RFC2049，上面有MIME的详细规范。Base64编码可用于在HTTP环境下传递较长的标识信息。例如，在Java Persistence系统Hibernate中，就采用了Base64来将一个较长的唯一标识符（一般为128-bit的UUID）编码为一个字符串，用作HTTP表单和HTTP GET URL中的参数。在其他应用程序中，也常常需要把二进制数据编码为适合放在URL（包括隐藏表单域）中的形式。此时，采用Base64编码具有不可读性，即所编码的数据不会被人用肉眼所直接看到。-->
    <!--</p>-->
    <p>请输入要进行编码或解码的字符：</p>
    <div class="wrapper" @mouseenter="showSrcCloseBtn" @mouseleave="hideSrcCloseBtn">
      <textarea class="base64-src" v-model="srcStr"></textarea>
      <transition name="src-close-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="close" @click="removeSrc" v-if="availableSrcClose">
          <md-icon>close</md-icon>
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
      <textarea class="base64-dest" v-model="destStr"></textarea>
      <transition name="dest-close-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="close" @click="removeDest" v-if="availableDestClose">
          <md-icon>close</md-icon>
        </div>
      </transition>
    </div>
  </md-tab>
</template>

<script>
//  require('../../static/js/base64.js')
  const Base64 = require('js-base64').Base64
  export default {
    data () {
      return {
        srcStr: 'test src str',
        destStr: 'test dest str',
        availableSrcClose: false,
        availableDestClose: false
      }
    },
    computed: {
      theme () {
        return this.$store.state.theme
      }
    },
    methods: {
      encode () {
//        this.destStr = doEncode(this.srcStr)
        this.destStr = Base64.encode(this.srcStr)
        console.log('....加密')
      },
      decode () {
        this.destStr = Base64.decode(this.srcStr)
        console.log('....解密')
      },
      removeSrc () {
        this.srcStr = ''
        console.log('清除srcStr')
      },
      removeDest () {
        this.destStr = ''
        console.log('清除destStr')
      },
      showSrcCloseBtn () {
        this.availableSrcClose = true
      },
      hideSrcCloseBtn () {
        this.availableSrcClose = false
      },
      showDestCloseBtn () {
        this.availableDestClose = true
      },
      hideDestCloseBtn () {
        this.availableDestClose = false
      }
    }
  }
</script>

<style lang="scss">
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
      .close {
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
      }
    }
    .btns {
      padding: 20px;
      display: flex;
      align-items: center;
    }
  }
</style>
