<template>
  <div id="app">
    <router-view></router-view>
    <transition name="global-mask-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div id="global-mask" v-if="showMask"></div>
    </transition>
    <transition name="side-menu-transition" enter-active-class="animated-p3 slideInLeft" leave-active-class="animated slideOutLeft">
      <div id="side-menu-container" v-if="sideMenuShown">
        <div class="side-menu-mask" @click="hideSideMenu"></div>
        <div class="side-menu"></div>
      </div>
    </transition>
    <div id="global-tip-container">
      <com-tip v-for="(value, item) in globalTips" :key="item" :data-id="item" :data-opts="globalTips[item]"></com-tip>
    </div>
    <div id="global-dialog-container">
      <com-dialog></com-dialog>
    </div>
    <div id="global-alert-container">
      <com-alert></com-alert>
    </div>
  </div>
</template>

<script>
  const types = require('../store/mutation-types.js')
  import ComTip from './ComTip.vue'
  import ComDialog from './ComDialog.vue'
  import ComAlert from './ComAlert.vue'
  export default {
    data () {
      return {
        sideMenuShown: false
      }
    },
    created () {
      if (!this.$store.hasOwnProperty('vms')) {
        this.$store.vms = {}
      }
      this.$store.vms.app = this
    },
    computed: {
      showMask () {
        return this.$store.state.showMask
      },
      globalTips () {
        return this.$store.state.globalTips
      }
    },
    methods: {
      showSideMenu () {
        this.sideMenuShown = true
        this.$store.commit(types.NEED_MASK, {
          shown: true
        })
      },
      hideSideMenu () {
        this.sideMenuShown = false
        this.$store.commit(types.NEED_MASK, {
          shown: false
        })
      }
    },
    components: {
      ComTip,
      ComDialog,
      ComAlert
    }
  }
</script>

<style lang="scss">
  @import "../../static/css/main.css";
  @import "../../static/css/vue-material.css";
  @import "../../static/css/animate.min.css";

  #app {
    width: 100%;
    height: 100%;
    #side-menu-container {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
      width: 100%;
      height: 100%;
      .side-menu-mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
      .side-menu {
        position: absolute;
        width: 200px;
        height: 100%;
        background-color: #ffffff;
      }
    }
    #global-mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .2);
    }

    #global-tip-container {
      position: fixed;
      width: 300px;
      /*min-height: 300px;*/
      right: 10px;
      top: 48px;
      z-index: 99999;
      /*overflow-y: hidden;*/
      background-color: transparent;
      .item {
        width: 100%;
        /*height: 48px;*/
        line-height: 2;
        margin-top: 10px;
        padding: 10px;
        border-radius: 5px;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -khtml-user-select: none;
        user-select: none;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        i {
          width: 20px;
          height: 20px;
          font-size: 20px;
          cursor: pointer;
        }
        &.success {
          color: #ffffff;
          background-color: #5cb85c;
          border: 1px solid #4cae4c;
        }
        &.info {
          color: #ffffff;
          background-color: #5bc0de;
          border: 1px solid #46b8da;
        }
        &.warning {
          color: #ffffff;
          background-color: #f0ad4e;
          border: 1px solid #eea236;
        }
        &.danger, &.error {
          color: #ffffff;
          background-color: #d9534f;
          border: 1px solid #d43f3a;
        }
      }
    }
  }
</style>
