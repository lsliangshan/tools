<template>
  <md-dialog-confirm
          :md-title="globalConfirm.title"
          :md-content="globalConfirm.content"
          :md-content-html="globalConfirm.contentHtml"
          :md-ok-text="globalConfirm.okText"
          @open="onOpen"
          @close="onClose"
          ref="globalConfirm">
  </md-dialog-confirm>
</template>

<script>
  import * as types from '../../store/mutation-types'
  export default {
    computed: {
      globalConfirm () {
        return this.$store.state.globalConfirm
      }
    },
    created () {
      if (!this.$store.hasOwnProperty('vms')) {
        this.$store.vms = {}
      }
      this.$store.vms['globalConfirm'] = this
    },
    methods: {
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref) {
        this.$refs[ref].close();
      },
      onOpen() {
        this.globalConfirm.opened && this.globalConfirm.opened()
      },
      onClose(type) {
        if (type === 'cancel') {
          // 选择了取消
          this.globalConfirm.cancel && this.globalConfirm.cancel()
        } else if (type === 'ok') {
          // 选择了确认
          this.globalConfirm.ok && this.globalConfirm.ok()
        } else {}
      }
    }
  }
</script>
