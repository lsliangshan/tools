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
  </div>
</template>

<script>
  const types = require('../store/mutation-types.js')
  export default {
    data () {
      return {
        sideMenuShown: false
      }
    },
    computed: {
      showMask () {
        return this.$store.state.showMask
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
  }
</style>
