<template>
  <md-dialog ref="globalDialog" :md-click-outside-to-close="false" :md-open-from="globalDialog.from" :md-close-to="globalDialog.to">
    <md-dialog-title v-text="globalDialog.title"></md-dialog-title>

    <md-dialog-content v-html="globalDialog.content"></md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" v-if="!!globalDialog.cancelText" @click.native="cancel" v-text="globalDialog.cancelText"></md-button>
      <md-button class="md-primary" @click.native="ok" v-text="globalDialog.okText"></md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
  import * as types from '../store/mutation-types'
  export default {
    computed: {
      globalDialog () {
        return this.$store.state.globalDialog
      }
    },
    created () {
      if (!this.$store.hasOwnProperty('vms')) {
        this.$store.vms = {}
      }
      this.$store.vms['globalDialog'] = this
    },
    methods: {
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref) {
        this.$refs[ref].close();
      },
      ok () {
        this.closeDialog('globalDialog')
        this.globalDialog.ok && this.globalDialog.ok()
      },
      cancel () {
        this.closeDialog('globalDialog')
        this.globalDialog.cancel && this.globalDialog.cancel()
      }
    }
  }
</script>
