<template>
  <div id="music-box">
    <a href="javascript:" class="music-btn" :class="!musicControl.play ? 'play' : 'pause'" @click="playOrPause" title="播放/暂停(Ctrl/Command+P)"></a>
    <div class="content" v-music-box-init="musicInfo.name" @click="toggleMusicContainer">
      <div class="content-inner">
        <div class="music-info" v-text="musicInfo.name + '-' + musicInfo.author"></div>
      </div>
    </div>
    <audio :src="musicInfo.url" controls id="bg-music" :currentTime="musicControl.currentTime.value" autoplay ref="bgMusic" v-music-loaded="musicInfo.url"></audio>
    <transition name="musicContainerTransition" enter-active-class="animated-p3 fadeIn" leave-active-class="animated-p3 fadeOut">
      <md-toolbar class="music-container" :md-theme="theme" md-elevation="10" v-if="showMusicContainer">
        <div class="close" @click="closeMusicContainer">×</div>
        <div class="main">
          <div class="inner">
            <a href="javascript:" class="music-btn prev" title="上一首(ctrl+←)" @click="playPrev"></a>
            <a href="javascript:" class="music-btn" :class="!musicControl.play ? 'play' : 'pause'" @click="playOrPause" title="播放/暂停(Ctrl/Command+P)"></a>
            <a href="javascript:" class="music-btn next" title="下一首(ctrl+→)" @click="playNext"></a>
            <div class="poster">
              <img src="/static/img/default_cover.jpeg" :src="musicInfo.poster">
            </div>
            <div class="play-container">
              <div class="desc">
                <span class="name t-hide" v-text="musicInfo.name"></span>
                <span class="author t-hide" v-text="musicInfo.author"></span>
              </div>
              <div class="progress-container">
                <div class="progress">
                  <vue-slider ref="slider" :real-time="true" v-bind="musicControl.currentTime" v-model="musicControl.currentTime.value" @callback="setCurrentTime"></vue-slider>
                </div>
                <div class="time">
                  <span v-format-time="musicControl.currentTime.value"></span>
                  /
                  <span v-format-time="musicControl.duration"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </md-toolbar>
    </transition>
  </div>
</template>

<script>
  import * as types from '../../store/mutation-types'
  import vueSlider from 'vue-slider-component'
  let animationId
  export default {
    data () {
      return {
        musics: [
          {
            name: '1. 演员',
            author: '薛之谦',
            url: 'http://cc.stream.qqmusic.qq.com/C100001Qu4I30eVFYb.m4a',
            poster: 'http://imgcache.qq.com/music/photo/album_300/94/300_albumpic_989994_0.jpg'
          },
          {
            name: '2. 丑八怪',
            author: '薛之谦',
            url: 'http://cc.stream.qqmusic.qq.com/C100000QwTVo0YHdcP.m4a',
            poster: 'http://imgcache.qq.com/music/photo/album_300/91/300_albumpic_443691_0.jpg'
          },
          {
            name: '3. Faded',
            author: 'Alan Walker',
            url: 'http://cc.stream.qqmusic.qq.com/C100002NkERn2LNVI4.m4a',
            poster: 'http://imgcache.qq.com/music/photo/album_300/28/300_albumpic_1211728_0.jpg'
          },
          {
            name: '4. 追梦赤子心',
            author: 'Gala',
            url: 'http://101.28.249.61/m10.music.126.net/20170625005530/a43bccec9ec8be732100253b3012f6d5/ymusic/ad19/f12c/9667/81b242ff2fa56e002c950f88e88162ac.mp3?wshc_tag=1&wsts_tag=594e93a7&wsid_tag=7b7b414f&wsiphost=ipdbm',
            poster: 'http://imgcache.qq.com/music/photo/singer/90/180_singerpic_4190_0.jpg'
          }
        ],
        currentMusicIndex: 1,
        musicControl: {
          interval: null,
          play: true,
//          currentTime: 0,   // 设置或返回音频中的当前播放位置（以秒计）。
          duration: 0,      // 返回音频的长度（以秒计）。
          currentTime: {
            value: 0,
            width: 493,
            height: 8,
            dotSize: 15,
            min: 0,
            max: 100,
            interval: 1,
            disabled: false,
            show: true,
            speed: 0.3,
            reverse: false,
            lazy: true,
            tooltip: 'none',
            piecewise: false,
            formatter: '',
            bgStyle: {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              boxShadow: 'inset 0.5px 0.5px 3px 1px rgba(0,0,0,.3)'
            },
            processStyle: {
              "backgroundColor": "#42b983"
            }
          },
          loop: 1  // 循环方式。1：单曲重复；2：列表重复；3：随机播放
        },
        showMusicContainer: false
      }
    },
    computed: {
      theme () {
        return this.$store.state.theme
      },
      musicInfo () {
        return this.musics[this.currentMusicIndex]
      }
    },
    mounted () {
      this.musicInfo = Object.assign(this.musicInfo, this.musics[this.currentMusicIndex])
    },
    methods: {
      play () {
        this.musicControl.play = true
        this.$refs.bgMusic.play()
      },
      pause () {
        this.musicControl.play = false
        this.$refs.bgMusic.pause()
      },
      playOrPause () {
        if (this.musicControl.play) {
          this.pause()
        } else {
          this.play()
        }
//        this.$refs.bgMusic.isPaused ? this.$refs.bgMusic.play() : this.$refs.bgMusic.pause()
//        this.musicControl.play = !this.musicControl.play
      },
      setCurrentTime () {
        const that = this
        setTimeout(function () {
          console.log(that.musicControl.currentTime.value)
          that.$refs.bgMusic.currentTime = that.musicControl.currentTime.value
        }, 10)
      },
      playNext () {
        switch (this.musicControl.loop) {
          case 1:
          case 2:
            this.currentMusicIndex = (this.currentMusicIndex + 1) % this.musics.length
            break
          case 3:
            this.currentMusicIndex = Math.floor(Math.random() * this.musics.length)
            break
          default:
            break
        }
      },
      playPrev () {
        switch (this.musicControl.loop) {
          case 1:
          case 2:
            this.currentMusicIndex = (this.currentMusicIndex + this.musics.length - 1) % this.musics.length
            break
          case 3:
            this.currentMusicIndex = Math.floor(Math.random() * this.musics.length)
            break
          default:
            break
        }
      },
      afterPlayEnd () {
        switch (this.musicControl.loop) {
          case 1:
            this.$refs.bgMusic.play()
            break
          case 2:
            this.currentMusicIndex = (this.currentMusicIndex + 1) % this.musics.length
            break
          case 3:
            this.currentMusicIndex = Math.floor(Math.random() * this.musics.length)
            break
          default:
            break
        }
      },
      toggleMusicContainer () {
        this.showMusicContainer = !this.showMusicContainer
      },
      closeMusicContainer () {
        this.showMusicContainer = false
      }
    },
    directives: {
      'musicBoxInit': {
        componentUpdated: function (el, binding, vnode) {
          if (!!animationId) {
            window.cancelAnimationFrame(animationId)
          }
          const _child = el.querySelector('.music-info')
          const _thisBox = el.querySelector('.content-inner').getBoundingClientRect()
          let _childBox = _child.getBoundingClientRect()
          function run () {
            _childBox = _child.getBoundingClientRect()
            let _left = _childBox.left - _thisBox.left - 0.5
            if (Math.abs(_left) > _childBox.width) {
              _left = _thisBox.width
            }
            _child.style.left = _left + 'px'
            animationId = window.requestAnimationFrame(run)
          }
          if (_childBox.width > _thisBox.width) {
            animationId = window.requestAnimationFrame(run)
          }
        }
      },
      'musicLoaded': {
        componentUpdated: function (el, binding, vnode) {
          el.onloadstart = function (ev) {
            console.log('load start: ', ev)
          }
          el.ondurationchange = function (ev) {
            console.log('duration change: ', ev)
          }
          el.onloadedmetadata = function (ev) {
            console.log('loaded meta data: ', ev)
          }
          el.onloadeddata = function (ev) {
            console.log('loaded data: ', ev)
          }
          el.onprogress = function (ev) {
            console.log('on progress: ', ev)
          }
          el.oncanplay = function (ev) {
            if (!!vnode.context.musicControl.interval) {
              clearInterval(vnode.context.musicControl.interval)
            }
            vnode.context.musicControl.currentTime.value = parseInt(ev.target.currentTime)
            vnode.context.musicControl.interval = setInterval(function () {
              vnode.context.musicControl.currentTime.value = parseInt(ev.target.currentTime)
            }, 1000)
            let _duration = parseInt(ev.target.duration)
            vnode.context.musicControl.currentTime.max = _duration
            vnode.context.musicControl.duration = _duration
            console.log('can play: ', ev)
          }
          el.oncanplaythrough = function (ev) {
            console.log('can play through: ', ev)
          }
          el.onended = function (ev) {
            console.log('播放结束!')
            vnode.context.afterPlayEnd()
          }
        }
      },
      'formatTime': {
        inserted: function (el, binding, vnode) {
          let _value = parseFloat(binding.value)
          el.innerHTML = (parseInt(_value / 60) < 10 ? ('0' + parseInt(_value / 60)) : parseInt(_value / 60)) + ':' + ((_value % 60) < 10 ? ('0' + (_value % 60)) : (_value % 60))
        },
        componentUpdated: function (el, binding, vnode) {
          let _value = parseFloat(binding.value)
          el.innerHTML = (parseInt(_value / 60) < 10 ? ('0' + parseInt(_value / 60)) : parseInt(_value / 60)) + ':' + ((_value % 60) < 10 ? ('0' + (_value % 60)) : (_value % 60))
        }
      }
    },
    components: {
      vueSlider
    }
  }
</script>

<style scoped lang="scss">
  .t-hide {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
  }
  .music-btn {
    background: url('../../../static/img/playbar.png') no-repeat 0 9999px;
    width: 36px;
    height: 36px;
    margin-top: 0;

  }
  #music-box {
    position: absolute;
    left: 180px;
    top: 0;
    width: 195px;
    height: 48px;
    z-index: 999;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .music-btn {
      position: relative;
      -webkit-transform: scale(0.8);
      -moz-transform: scale(0.8);
      -ms-transform: scale(0.8);
      -o-transform: scale(0.8);
      transform: scale(0.8);
      &.play {
        background-position: 0 -204px;
        &:hover {
          background-position: -40px -204px;
        }
      }
      &.pause {
        background-position: 0 -165px;
        &:hover {
          background-position: -40px -165px;
        }
      }
    }
    .content {
      position: absolute;
      width: 150px;
      height: 30px;
      line-height: 30px;
      color: #ffffff;
      /*overflow: hidden;*/
      white-space: nowrap;
      background-color: #333;
      border-radius: 3px;
      padding: 0 5px;
      left: 40px;
      .content-inner {
        position: relative;
        width: 140px;
        overflow: hidden;
        height: 100%;
        .music-info {
          position: absolute;
          left: 0;
        }
      }
    }
    .music-container {
      position: fixed;
      z-index: 8;
      width: 100%;
      height: 48px;
      left: 0;
      top: 48px;
      padding-right: 35px;
      border-top: 1px solid rgba(0, 0, 0, .3);
      cursor: hand!important;
      .close {
        position: absolute;
        font-size: 24px;
        cursor: pointer;
        right: 10px;
      }
      .main {
        width: 100%;
        height: 100%;
        cursor: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        .music-btn {
          -webkit-transform: scale(1);
          -moz-transform: scale(1);
          -ms-transform: scale(1);
          -o-transform: scale(1);
          transform: scale(1);
        }
        .inner {
          display: flex;
          align-items: center;
          .prev {
            width: 28px;
            height: 28px;
            background-position: 0 -130px;
            &:hover {
              background-position: -30px -130px;
            }
          }
          .play {
            background-position: 0 -204px;
            margin: 0 8px;
            &:hover {
              background-position: -40px -204px;
            }
          }
          .pause {
            background-position: 0 -165px;
            margin: 0 8px;
            &:hover {
              background-position: -40px -165px;
            }
          }
          .next {
            width: 28px;
            height: 28px;
            background-position: -80px -130px;
            &:hover {
              background-position: -110px -130px;
            }
          }
          .poster {
            width: 34px;
            height: 34px;
            border-radius: 3px;
            cursor: pointer;
            overflow: hidden;
            margin-left: 30px;
          }
          .play-container {
            position: relative;
            width: 608px;
            height: 63px;
            margin-left: 10px;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            .desc {
              position: absolute;
              width: 100%;
              height: 30px;
              font-size: 12px;
              top: 0;
              line-height: 30px;
              .name {
                display: inline-block;
                color: #e8e8e8;
                max-width: 300px;
              }
              .author {
                display: inline-block;
                max-width: 220px;
                color: #9b9b9b;
                margin-left: 15px;
              }
            }
            .progress-container {
              position: absolute;
              top: 30px;
              width: 100%;
              font-size: 12px;
              line-height: 30px;
              display: inline-flex;
              align-items: center;
              justify-content: flex-start;
              .progress {
                width: 493px;
                height: 30px;
              }
              .time {
                margin-left: 8px;
                margin-top: -5px;
              }
            }
          }
        }
      }
    }
  }
  #bg-music {
    position: absolute;
    left: -1000px;
    opacity: 0;
    z-index: -1;
  }
</style>
