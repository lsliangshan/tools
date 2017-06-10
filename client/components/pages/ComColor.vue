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
              <div class="select-type">
                <!--<label for="food">Food</label>-->
                <md-select class="type-selector" v-model="selectedType" @change="changeSelectedType($event)">
                  <!--<md-subheader>Fruits</md-subheader>-->
                  <md-option v-for="(item, index) in allTypes" :key="item" :value="item">{{item}}</md-option>
                </md-select>
              </div>
              <div class="input-color">
                <!--<label>输入颜色</label>-->
                <md-input placeholder="输入颜色" :value="formInfo.cacheOriginValue" @change="inputColor($event)"></md-input>
              </div>
            </md-input-container>
            <div class="sample" :style="{backgroundColor: formInfo.originValue || theme}"></div>
          </div>
        </md-card-header>

        <md-card-expand>
          <md-card-actions :class="selectedType!='常规色值'?'disabled':''">
            <span>高级选项</span>
            <span style="flex: 1"></span>
            <md-button class="md-icon-button" md-expand-trigger :class="selectedType=='常规色值'?'':'pen'">
              <md-icon class="cp">keyboard_arrow_down</md-icon>
            </md-button>
          </md-card-actions>

          <md-card-content>
            <div class="item-content">
              <span class="mb5">darken</span>
              <div class="darken-value">
                <vue-slider ref="slider" :real-time="true" v-bind="darkenOpts" v-model="darkenOpts.value" @callback="setDarken"></vue-slider>
              </div>
              <input type="number" :value="darkenOpts.value" @input="changeDarkenValue($event)">
            </div>
          </md-card-content>
        </md-card-expand>
      </md-card>
    </div>
    <div class="output-box">
      <div class="md-subhead">输出</div>
      <div class="output-item" v-for="(item, index) in colorTypes" :key="item">
        <span v-text="item + ':'"></span>
        <div class="value" v-text="outputColor[item] || ''"></div>
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
          originValue: '',
          cacheOriginValue: ''
        },
        selectedType: '常规色值',
        allTypes: ['常规色值', 'hsv', 'hsi', 'lab', 'lch', 'hcl', 'gl'],
        colorTypes: ['hex', 'rgb', 'rgba', 'hsl', 'hsv', 'hsi', 'lab', 'lch', 'hcl', 'gl']
      }
    },
    computed: {
      outputColor () {
        let _originValue = this.formInfo.cacheOriginValue
        const _colorType = this.selectedType
        switch (_colorType) {
          case 'hsv':
            _originValue = chroma.hsv(_originValue.split(',')).hex()
//            this.inputColor(_originValue)
            break
          case 'hsi':
            _originValue = chroma.hsi(_originValue.split(',')).hex()
//            this.inputColor(_originValue)
            break
          case 'lab':
            _originValue = chroma.lab(_originValue.split(',')).hex()
//            this.inputColor(_originValue)
            break
          case 'lch':
            _originValue = chroma.lch(_originValue.split(',')).hex()
//            this.inputColor(_originValue)
            break
          case 'hcl':
            _originValue = chroma.hcl(_originValue.split(',')).hex()
//            this.inputColor(_originValue)
            break
          case 'gl':
            _originValue = chroma.gl(_originValue.split(',')).hex()
//            this.inputColor(_originValue)
            break
          case '常规色值':
            break
          default :
            break
        }
        this.formInfo.originValue = _originValue
        console.log('+++++>>>>>>', _originValue)
        const _theme = this.theme
        let out = {}
        try {
//          chroma(this.formInfo.originValue)
          out = {
            hex: chroma(_originValue || _theme).hex(),
            rgb: 'rgb(' + chroma(_originValue || _theme).rgb().join(', ') + ')',
            rgba: 'rgba(' + chroma(_originValue || _theme).rgba().join(', ') + ')',
            hsl: chroma(_originValue || _theme).css('hsl'),
//            hsl: 'hsl(' + chroma(_originValue || _theme).hsl().join(', ') + ')',
            hsv: chroma(_originValue || _theme).hsv(),
            hsi: chroma(_originValue || _theme).hsi(),
            lab: chroma(_originValue || _theme).lab(),
            lch: chroma(_originValue || _theme).lch(),
            hcl: chroma(_originValue || _theme).hcl(),
            gl: chroma(_originValue || _theme).gl()
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
          value: 0,
          width: 200,
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
      changeSelectedType (target) {
        const that = this
        let _originValue = this.formInfo.cacheOriginValue
        switch (target) {
          case 'hsv':
            _originValue = chroma.hsv(_originValue.split(',')).hex()
            break
          case 'hsi':
            _originValue = chroma.hsi(_originValue.split(',')).hex()
            break
          case 'lab':
            _originValue = chroma.lab(_originValue.split(',')).hex()
            break
          case 'lch':
            _originValue = chroma.lch(_originValue.split(',')).hex()
            break
          case 'hcl':
            _originValue = chroma.hcl(_originValue.split(',')).hex()
            break
          case 'gl':
            _originValue = chroma.gl(_originValue.split(',')).hex()
            break
          case '常规色值':
            break
          default :
            break
        }
        setTimeout(function () {
          that.formInfo.originValue = _originValue
        }, 50)
      },
      inputColor (val) {
        this.formInfo.originValue = val
        this.formInfo.cacheOriginValue = val
      },
      changeDarkenValue (target) {
        if (Number(target.target.value) >= 0 && Number(target.target.value) <= 7.4) {
          this.darkenOpts.value = Number(target.target.value)
          this.setDarken()
        } else {
          if (Number(target.target.value) < 0) {
            target.target.value = 0
          } else if (Number(target.target.value) > 7.4) {
            target.target.value = 7.4
          }
        }
      },
      darken (color, value) {
        return chroma(color).darken(value).hex()
      },
      setDarken () {
        const that = this
        let darkenTimeout = setTimeout(function () {
          that.formInfo.originValue = chroma(that.formInfo.cacheOriginValue).darken(that.darkenOpts.value).hex()
          clearTimeout(darkenTimeout)
        }, 10)
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
        .type-selector {
          min-width: 90px;
          text-align: center!important;
        }
        .input-color {
          margin-left: 15px;
        }
      }
      .md-card-content {
        .item-content {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          input {
            width: 80px;
            margin-bottom: 5px;
          }
        }
      }
      .md-card-actions {
        &.disabled {
          color: #bbb!important;
          cursor: not-allowed!important;
          i {
            color: #bbb!important;
            cursor: not-allowed!important;
          }
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
    top: 10px;
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
        width: 40px;
      }
      .value {
        text-align: center;
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
  .pen {
    pointer-events: none;
  }
</style>
