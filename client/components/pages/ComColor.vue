<template>
  <md-tab md-label="color" class="color-container" md-tooltip="颜色工具">
    <div class="color-card">
      <md-card md-with-hover class="ch">
        <md-card-media md-ratio="16:9">
          <img src="../../../static/img/bg-1.jpg" alt="People">
        </md-card-media>

        <md-card-header>
          <div class="item">
            <md-input-container>
              <label>输入颜色</label>
              <md-input placeholder="输入颜色" v-model="formInfo.originValue"></md-input>
            </md-input-container>
            <div class="sample" :style="{backgroundColor: formInfo.originValue || theme}"></div>
          </div>
        </md-card-header>

        <md-card-expand>
          <md-card-actions>
            <span>高级选项</span>
            <span style="flex: 1"></span>
            <md-button class="md-icon-button" md-expand-trigger>
              <md-icon class="cp">keyboard_arrow_down</md-icon>
            </md-button>
          </md-card-actions>

          <md-card-content>
            <div class="item-content">
              <span class="mb5">darken</span>
              <div class="darken-value">
                <vue-slider ref="slider" :real-time="true" v-bind="darkenOpts" v-model="darkenOpts.value"></vue-slider>
              </div>
            </div>
            <div class="item-content">
              <span class="mb5">lighten</span>
              <div class="lighten-value">
                <vue-slider ref="slider" :real-time="true" v-bind="lightenOpts" v-model="lightenOpts.value"></vue-slider>
              </div>
            </div>
          </md-card-content>
        </md-card-expand>
      </md-card>
    </div>
    <div class="output-box">
      <div class="md-subhead">输出</div>
      <div class="output-item">
        <span>Hex: </span>
        <div class="value" v-text="outputColor.hex || ''"></div>
      </div>
      <div class="output-item">
        <span>Rgb: </span>
        <div class="value" v-text="outputColor.rgb || ''"></div>
      </div>
      <div class="output-item">
        <span>Rgba: </span>
        <div class="value" v-text="outputColor.rgba || ''"></div>
      </div>
    </div>
  </md-tab>
</template>

<script>
  import * as types from '../../store/mutation-types'
  import vueSlider from 'vue-slider-component'
  import chroma from 'chroma-js'
  export default {
    data () {
      return {
        formInfo: {
          originValue: ''
        }
      }
    },
    computed: {
      outputColor () {
        let out = {}
        try {
          chroma(this.formInfo.originValue)
          out = {
            rgb: 'rgb(' + chroma(this.formInfo.originValue || this.theme).rgb().join(', ') + ')',
            rgba: 'rgba(' + chroma(this.formInfo.originValue || this.theme).rgba().join(', ') + ')',
            hex: chroma(this.formInfo.originValue || this.theme).hex()
          }
        } catch (err) {

        }
        return out
      },
      theme () {
        return this.$store.state.theme
      },
      darkenOpts () {
        let opts = {
          value: 1,
          width: 280,
          height: 8,
          dotSize: 20,
          min: 0,
          max: 7.4,
          interval: 0.1,
          disabled: false,
          show: true,
          speed: 0.3,
          reverse: false,
          lazy: true,
          tooltip: 'always',
          piecewise: false,
          formatter: '',
          bgStyle: {
            backgroundColor: '#fff',
            boxShadow: 'inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36)'
          }
        }
        opts.processStyle = {
          backgroundColor: this.theme
        }
        opts.tooltipStyle = {
          backgroundColor: this.theme,
          borderColor: this.theme
        }
        return opts
      },
      lightenOpts () {
        let opts = {
          value: 1,
          width: 280,
          height: 8,
          dotSize: 20,
          min: 0,
          max: 7.4,
          interval: 0.1,
          disabled: false,
          show: true,
          speed: 0.3,
          reverse: false,
          lazy: true,
          tooltip: 'always',
          piecewise: false,
          formatter: '',
          bgStyle: {
            backgroundColor: '#fff',
            boxShadow: 'inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36)'
          }
        }
        opts.processStyle = {
          backgroundColor: this.theme
        }
        opts.tooltipStyle = {
          backgroundColor: this.theme,
          borderColor: this.theme
        }
        return opts
      }
    },
    created () {

    },
    methods: {
      darken (color, value) {
        return chroma(color).darken(value).hex()
      }
    },
    components: {
      vueSlider
    }
  }
</script>

<style scoped lang="scss">
  .color-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .color-card {
      width: 400px;
      .md-card-actions {
        padding-left: 16px;
      }
      .md-card-content {
        max-height: 500px;
        overflow-y: auto;
      }
      .item {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        .sample {
          width: 70px;
          height: 70px;
          border: 1px solid #ddd;
          -webkit-transition: all .3s ease-in-out;
          -moz-transition: all .3s ease-in-out;
          -ms-transition: all .3s ease-in-out;
          -o-transition: all .3s ease-in-out;
          transition: all .3s ease-in-out;
        }
        .md-input-container {
          max-width: 280px;
          margin-bottom: 0;
        }
      }
      .md-card-content {
        .item-content {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
      }
    }
  }
  .darken-value, .lighten-value {
    margin-top: 40px;
  }
  .output-box {
    position: absolute;
    right: 0;
    top: 100px;
    width: 250px;
    height: auto;
    min-height: 100px;
    padding: 15px;
    z-index: 999;
    background-color: #ffffff;
    border: 1px solid #ddd;
    .output-item {
      padding: 5px;
      margin-top: 5px;
      border-top: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      span {
        width: 60px;
      }
    }
  }
  .md-tooltip {
    margin-top: -10px!important;
  }
  .cp {
    cursor: pointer;
  }
  .ch {
    cursor: hand!important;
  }
  .mb5 {
    margin-bottom: 5px;
  }
</style>
