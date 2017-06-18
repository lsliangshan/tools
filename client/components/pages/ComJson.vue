<template>
  <md-tab md-label="json" class="json-container" md-tooltip="json解析">
    <div class="json-src" :class="srcContainerShown ? '' : 'hide'" @mouseenter="showToggle" @mouseleave="hideToggle">
      <!--<div class="json-src-header">-->
        <!--<i class="fa fa-fw fa-angle-double-left"></i>-->
      <!--</div>-->
      <div class="json-src-wrapper">
        <textarea name="json-src" id="json-src" @input="changeSrc($event)" placeholder="请输入JSON字符串"></textarea>
      </div>
      <transition name="toggle-transition" enter-active-class="animated-p3 fadeIn" leave-active-class="animated-p3 fadeOut">
        <div class="toggle" v-if="toggleShown" @click="toggleSrcContainer($event)">
          <i class="fa fa-fw" :class="srcContainerShown? 'fa-angle-double-left' : 'fa-angle-double-right'"></i>
          <md-tooltip md-direction="right" style="top: calc(50% - 5px);" v-text="srcContainerShown? '收拢' : '展开'"></md-tooltip>
        </div>
      </transition>
    </div>
    <div class="blank" style="width: 15px;"></div>
    <div class="json-dest-container">
      <div class="json-dest-header">
        <div data-clipboard-target="#json-dest" @mouseenter="expandAll" class="copy-format-json operate">
          <md-icon>content_copy</md-icon>
          <md-tooltip md-direction="bottom">复制文本</md-tooltip>
        </div>
        <div class="operate" @click="expandAll">
          <i class="fa fa-fw fa-expand"></i>
          <md-tooltip md-direction="bottom">展开全部</md-tooltip>
        </div>
        <div class="operate" @click="compressAll">
          <i class="fa fa-fw fa-compress"></i>
          <md-tooltip md-direction="bottom">收拢全部</md-tooltip>
        </div>
      </div>
      <div class="json-dest-wrapper">
        <div class="json-dest" id="json-dest" v-html="destStr"></div>
      </div>
    </div>
  </md-tab>
</template>

<script>
  import * as types from '../../store/mutation-types'
  import '../../../static/js/jquery.json'
  import '../../../static/js/json2'
  import '../../../static/js/jsonlint'
  const Clipboard = require('clipboard')

  export default {
    data () {
      return {
        currentJson: '',
        currentJsonStr: '',
        destStr: '',
        toggleShown: false,
        srcContainerShown: true
      }
    },
    computed: {
      theme () {
        return this.$store.state.theme
      }
    },
    created () {
      const that = this
      const clipboard = new Clipboard('.copy-format-json', {})
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
      changeSrc (target) {
        let content = target.target.value
        let result = ''
        if (content !== '') {
          try {
            this.currentJson = jsonlint.parse(content)
            this.currentJsonStr = JSON.stringify(this.currentJson)
            result = new JSONFormat(content, 4).toString()
          } catch (e) {
            result = '<span style="color: #f1592a; font-weight: bold;">' + e + '</span>'
            this.currentJsonStr = result
          }

          this.destStr = result
        } else {
          this.destStr = ''
        }
      },
      showToggle () {
        this.toggleShown = true
      },
      hideToggle () {
        this.toggleShown = false
      },
      toggleSrcContainer () {
        this.srcContainerShown = !this.srcContainerShown
      },
      expandAll () {
        new JSONFormat(this.currentJsonStr, 4).showAll()
      },
      compressAll () {
        new JSONFormat(this.currentJsonStr, 4).hideAll()
      }
    }
  }
</script>

<style scoped lang="scss">
  /*i {*/
    /*margin-right: 5px;*/
  /*}*/
  .json_number, .json_string, .json_boolean {
    margin-left: 5px;
  }
  .json-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .json-src {
      position: relative;
      width: 100%;
      height: 100%;
      border: 1px solid #ddd;
      -webkit-transition: all .3s ease-in-out;
      -moz-transition: all .3s ease-in-out;
      -o-transition: all .3s ease-in-out;
      transition: all .3s ease-in-out;
      &.hide {
        width: 10%;
      }
      .json-src-header {
        width: 100%;
        height: 32px;
        background-color: #e5e5e5;
      }
      .json-src-wrapper {
        width: 100%;
        height: 100%;
        /*height: calc(100% - 32px);*/
        textarea {
          width: 100%;
          height: 100%;
          padding: 10px;
          border: none;
          resize: none;
        }
      }
      .toggle {
        position: absolute;
        width: 32px;
        height: 100%;
        right: 0;
        top: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        background: -webkit-gradient(linear, 0 50%, 200% 50%, from(rgba(255, 255, 255, .2)), to(#e5e5e5));
      }
    }
    .json-dest-container {
      width: 100%;
      height: 100%;
      border: 1px solid #ddd;
      .json-dest-header {
        width: 100%;
        height: 32px;
        background-color: #e5e5e5;
        /*.operate {*/
          /*display: inline-block;*/
          /*width: 32px;*/
          /*height: 32px;*/
          /*line-height: 32px;*/
          /*text-align: center;*/
        /*}*/
        .operate {
          position: relative;
          display: inline-block;
          width: 32px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          cursor: pointer;
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
      .json-dest-wrapper {
        width: 100%;
        height: calc(100% - 32px);
        overflow-x: hidden;
        overflow-y: auto;
        .json-dest {
          padding: 10px;
        }
      }
    }
  }
</style>
