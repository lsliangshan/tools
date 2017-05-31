<template>
  <md-dialog ref="dialog1">
    <md-dialog-title>Lorem ipsum dolor sit amet</md-dialog-title>

    <md-dialog-content>Nemo, nobis necessitatibus ut illo, ducimus ex.</md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click.native="closeDialog('dialog1')">Cancel</md-button>
      <md-button class="md-primary" @click.native="closeDialog('dialog1')">Ok</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
  import * as types from '../store/mutation-types'
  export default {
    props: ['dataOpts', 'dataId'],
    data () {
      return {
        shown: false
      }
    },
    computed: {
      globalDialog () {
        return this.$store.state.globalDialog
      }
    },
    created () {
//      this.openDialog(this.$refs.dialog1)
    },
    methods: {
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref) {
        this.$refs[ref].close();
      },
      onOpen() {
        console.log('Opened');
      },
      onClose(type) {
        console.log('Closed', type);
      }
    }
  }
</script>

<style lang="scss">
  .tip-item {
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
    .type-icon {
      display: inline-flex;
      align-items: flex-start;
      justify-content: flex-start;
      p {
        margin-left: 10px;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }
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
</style>
