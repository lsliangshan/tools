<template>
  <md-dialog-prompt
          :md-title="globalPrompt.title"
          :md-content="globalPrompt.content"
          :md-content-html="globalPrompt.contentHtml"
          :md-ok-text="globalPrompt.okText"
          :md-cancel-text="globalPrompt.cancelText"
          v-model="globalPrompt.inputModel"
          :md-input-id="globalPrompt.inputId"
          :md-input-name="globalPrompt.inputName"
          :md-input-maxlength="globalPrompt.inputMaxLength"
          :md-input-placeholder="globalPrompt.inputPlaceholder"
          @open="onOpen"
          @close="onClose"
          ref="globalPrompt"
  ></md-dialog-prompt>
</template>

<script>
  import * as types from '../../store/mutation-types'
  export default {
    computed: {
      globalPrompt () {
        return this.$store.state.globalPrompt
      }
    },
    created () {
      if (!this.$store.hasOwnProperty('vms')) {
        this.$store.vms = {}
      }
      this.$store.vms['globalPrompt'] = this
    },
    methods: {
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref) {
        this.$refs[ref].close();
      },
      onOpen() {
        this.globalPrompt.opened && this.globalPrompt.opened()
      },
      onClose(type) {
        if (type === 'cancel') {
          // 选择了取消
          this.globalPrompt.cancel && this.globalPrompt.cancel()
        } else if (type === 'ok') {
          // 选择了确认
          this.globalPrompt.ok && this.globalPrompt.ok(this.globalPrompt.inputModel)
        } else {}
      }
    }
  }
</script>
