<template>
  <md-dialog-alert
          :md-title="globalAlert.title"
          :md-content="globalAlert.content"
          :md-content-html="globalAlert.contentHtml"
          :md-ok-text="globalAlert.okText"
          :md-cancel-text="globalAlert.cancelText"
          @open="onOpen"
          @close="onClose"
          ref="globalAlert">
  </md-dialog-alert>
</template>

<script>
  import * as types from '../../store/mutation-types'
  export default {
    computed: {
      globalAlert () {
        return this.$store.state.globalAlert
      }
    },
    created () {
      if (!this.$store.hasOwnProperty('vms')) {
        this.$store.vms = {}
      }
      this.$store.vms['globalAlert'] = this
    },
    methods: {
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref) {
        this.$refs[ref].close();
      },
      onOpen() {
        this.globalAlert.opened && this.globalAlert.opened()
      },
      onClose(type) {
        this.globalAlert.closed && this.globalAlert.closed()
      },
      ok () {
        this.closeDialog('globalAlert')
        this.globalAlert.ok && this.globalAlert.ok()
      }
    }
  }
</script>
