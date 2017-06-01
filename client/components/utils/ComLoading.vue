<template>
  <transition name="global-loading-transition" enter-active-class="animated-p3 fadeIn" leave-active-class="animated-p3 fadeOut">
    <div id="global-loading-container" v-if="globalLoading.shown">
      <div class="loading-container">
        <md-spinner :md-size="60" md-indeterminate :md-theme="theme"></md-spinner>
      </div>
    </div>
  </transition>
</template>

<script>
  import * as types from '../../store/mutation-types'
  export default {
    computed: {
      theme () {
        return this.$store.state.theme
      },
      globalLoading () {
        return this.$store.state.globalLoading
      }
    },
    created () {
      if (!this.$store.hasOwnProperty('vms')) {
        this.$store.vms = {}
      }
      this.$store.vms['globalLoading'] = this
    },
    methods: {
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref) {
        this.$refs[ref].close();
      },
      onOpen() {
        this.globalLoading.opened && this.globalLoading.opened()
      },
      onClose(type) {
        this.globalLoading.closed && this.globalLoading.closed()
      }
    }
  }
</script>

<style lang="scss">
  #global-loading-container {
    position: fixed;
    left: 0;
    top: 48px;
    width: 100%;
    height: calc(100% - 48px);
    z-index: 999999;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    .loading-container {
      width: 100px;
      min-height: 100px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, .8);
    }
  }
</style>
