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
                  <span class="current-time" v-format-time="musicControl.currentTime.value"></span>
                  /
                  <span class="duration" v-format-time="musicControl.duration"></span>
                </div>
              </div>
            </div>
            <a href="javascript:" class="music-btn" :class="audioMuted ? 'volume-muted' : 'volume'" @click="toggleVolumeSettings($event)" title="设置音量">
              <transition name="volume-settings-transition" enter-active-class="animated-p3 fadeIn" leave-active-class="animated-p3 fadeOut">
                <div class="volume-settings" v-if="musicControl.showVolumeSettings">
                  <vue-slider ref="volumeSlider" :real-time="true" v-bind="musicControl.volume" v-model="musicControl.volume.value" @callback="setVolume"></vue-slider>
                </div>
              </transition>
            </a>
            <a href="javascript:" class="music-btn loop-one" v-if="musicControl.loop==0" :data-value="musicControl.loop" @click="setLoop($event)" title="单曲循环"></a>
            <a href="javascript:" class="music-btn loop-all" v-if="musicControl.loop==1" :data-value="musicControl.loop" @click="setLoop($event)" title="循环"></a>
            <a href="javascript:" class="music-btn loop-shuffle" v-if="musicControl.loop==2" :data-value="musicControl.loop" @click="setLoop($event)" title="随机"></a>
            <a href="javascript:" class="music-btn list" title="播放列表" @click="toggleMusicList($event)">
              <span class="pen" v-text="musics.length"></span>
              <transition name="music-list-container-transition" enter-active-class="animated-p3 fadeIn" leave-active-class="animated-p3 fadeOut">
                <div class="music-list-container" v-if="showMusicListContainer">
                  <div class="list-header">
                    播放列表（<span v-text="musics.length"></span>）
                    <div class="close" @click="closeMusicList">×</div>
                  </div>
                  <div class="list-main">
                    <div class="list-item" v-for="(item, index) in musics" :key="item" :data-index="index" @click="playMusic($event)" :class="currentMusicIndex==index ? 'active' : ''" @mouseenter="showListOperation($event)" @mouseleave="hideListOperation($event)">
                      <transition name="play-icon-transition" enter-active-class="animated-p3 fadeIn" leave-active-class="animated-p3 fadeOut">
                        <div class="play-icon">
                          <i v-if="currentMusicIndex == index" class="fa fa-fw fa-play"></i>
                        </div>
                      </transition>
                      <div class="name" v-text="item.name"></div>
                      <div class="operation">
                        <!--<i v-if="showMusicListOperation == index && musics.length > 1" class="fa fa-fw fa-trash remove-music" @click="removeMusic($event, index)"></i>-->
                      </div>
                      <div class="author" v-text="item.author"></div>
                      <div class="duration" v-get-audio-duration="item.url"></div>
                    </div>
                  </div>
                </div>
              </transition>
            </a>
          </div>
        </div>
      </md-toolbar>
    </transition>
  </div>
</template>

<script>
  import $ from 'jquery'
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
            name: '4. 逆流成河',
            author: '金南玲',
            url: 'http://fs.web.kugou.com/a24f1725728a18c99d5d50c338097e9e/594f1c05/G014/M0B/18/1F/roYBAFUPcU-ARySKAB6UkcwIEo0179.mp3',
            poster: 'http://imge.kugou.com/stdmusic/20150715/20150715201344601548.jpg'
          },
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
            name: '4. 逆流成河',
            author: '金南玲',
            url: 'http://fs.web.kugou.com/a24f1725728a18c99d5d50c338097e9e/594f1c05/G014/M0B/18/1F/roYBAFUPcU-ARySKAB6UkcwIEo0179.mp3',
            poster: 'http://imge.kugou.com/stdmusic/20150715/20150715201344601548.jpg'
          },
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
            name: '4. 逆流成河',
            author: '金南玲',
            url: 'http://fs.web.kugou.com/a24f1725728a18c99d5d50c338097e9e/594f1c05/G014/M0B/18/1F/roYBAFUPcU-ARySKAB6UkcwIEo0179.mp3',
            poster: 'http://imge.kugou.com/stdmusic/20150715/20150715201344601548.jpg'
          },
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
            name: '4. 逆流成河',
            author: '金南玲',
            url: 'http://fs.web.kugou.com/a24f1725728a18c99d5d50c338097e9e/594f1c05/G014/M0B/18/1F/roYBAFUPcU-ARySKAB6UkcwIEo0179.mp3',
            poster: 'http://imge.kugou.com/stdmusic/20150715/20150715201344601548.jpg'
          },
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
            name: '4. 逆流成河',
            author: '金南玲',
            url: 'http://fs.web.kugou.com/a24f1725728a18c99d5d50c338097e9e/594f1c05/G014/M0B/18/1F/roYBAFUPcU-ARySKAB6UkcwIEo0179.mp3',
            poster: 'http://imge.kugou.com/stdmusic/20150715/20150715201344601548.jpg'
          }
        ],
        currentMusicIndex: Math.floor(Math.random() * 4),
        musicControl: {
          interval: null,
          play: true,
          showVolumeSettings: false,
          volume: {
            value: 0,
            width: 4,
            height: 113,
            dotSize: 10,
            direction: 'vertical',
            tooltipDir: 'right',
            reverse: true,
            min: 0,
            max: 100,
            interval: 1,
            disabled: false,
            show: true,
            speed: 0.3,
            lazy: true,
            tooltip: 'always',
            piecewise: false,
            formatter: '',
            bgStyle: {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              boxShadow: 'inset 0.5px 0.5px 3px 1px rgba(0,0,0,.3)'
            },
            tooltipStyle: {
              backgroundColor: '#42b983',
              border: '#42b983'
            },
            processStyle: {
              "backgroundColor": "#42b983"
            }
          },
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
          loop: 0  // 循环方式。0：单曲重复；1：列表重复；2：随机播放
        },
        showMusicContainer: false,
        showMusicListContainer: false,
        showMusicListOperation: -1
      }
    },
    computed: {
      theme () {
        return this.$store.state.theme
      },
      musicInfo () {
        return this.musics[this.currentMusicIndex]
      },
      audioMuted () {
        return Number(this.musicControl.volume.value) === 0
      }
    },
    created () {
      const that = this
      $.get('http://127.0.0.1:3002/index/fetchPage', function (res) {
        res.forEach(function (item, index, self) {
          self[index] = {
            name: (index + 1) + '. No Name',
            author: 'Unknown',
            url: decodeURIComponent(item),
            poster: 'http://imgcache.qq.com/music/photo/album_300/94/300_albumpic_989994_0.jpg'
          }
        })
        that.musics = res
//        that.musics = res
      })
    },
    mounted () {
      this.musicInfo = Object.assign(this.musicInfo, this.musics[this.currentMusicIndex])
    },
    methods: {
      toggleVolumeSettings (target) {
        if (target.target.classList.contains('volume') || target.target.classList.contains('volume-muted')) {
          this.musicControl.showVolumeSettings = !this.musicControl.showVolumeSettings
        }
      },
      setVolume () {
        const that = this
        setTimeout(function () {
          that.$refs.bgMusic.volume = parseFloat(that.musicControl.volume.value / 100)
        }, 10)
      },
      setLoop (target) {
        this.musicControl.loop = (Number(target.target.dataset.value) + 1) % 3
      },
      playMusic (target) {
        this.currentMusicIndex = Number(target.target.dataset.index)
      },
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
      },
      setCurrentTime () {
        const that = this
        setTimeout(function () {
          that.$refs.bgMusic.currentTime = that.musicControl.currentTime.value
        }, 10)
      },
      playNext () {
        switch (this.musicControl.loop) {
          case 0:
          case 1:
            this.currentMusicIndex = (this.currentMusicIndex + 1) % this.musics.length
            break
          case 2:
            this.currentMusicIndex = Math.floor(Math.random() * this.musics.length)
            break
          default:
            break
        }
      },
      playPrev () {
        switch (this.musicControl.loop) {
          case 0:
          case 1:
            this.currentMusicIndex = (this.currentMusicIndex + this.musics.length - 1) % this.musics.length
            break
          case 2:
            this.currentMusicIndex = Math.floor(Math.random() * this.musics.length)
            break
          default:
            break
        }
      },
      afterPlayEnd () {
        switch (this.musicControl.loop) {
          case 0:
            break
          case 1:
            this.currentMusicIndex = (this.currentMusicIndex + 1) % this.musics.length
            break
          case 2:
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
      },
      toggleMusicList (target) {
        if (target.target.classList.contains('list')) {
          this.showMusicListContainer = !this.showMusicListContainer
        }
      },
      closeMusicList () {
        this.showMusicListContainer = false
      },
      showListOperation (target) {
        this.showMusicListOperation = Number(target.target.dataset.index)
      },
      hideListOperation () {
        this.showMusicListOperation = -1
      },
      removeMusic (target, index) {
        if (target.target.classList.contains('remove-music')) {
          target.stopPropagation()
          if (Number(index) === this.musics.length - 1) {
            this.currentMusicIndex = this.musics.length - 2
          } else {
            if (this.musics.length > 1 && index < this.currentMusicIndex) {
              this.currentMusicIndex -= 1
            }
          }
          this.musics.splice(index, 1)
        }
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
        inserted: function (el, binding, vnode) {
          el.onloadstart = function (ev) {
          }
          el.ondurationchange = function (ev) {
          }
          el.onloadedmetadata = function (ev) {
          }
          el.onloadeddata = function (ev) {
          }
          el.onprogress = function (ev) {
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
            vnode.context.musicControl.volume.value = parseInt(ev.target.volume * 100)
            vnode.context.musicControl.play = !ev.target.paused
          }
          el.oncanplaythrough = function (ev) {
          }
          el.onended = function (ev) {
            vnode.context.afterPlayEnd()
          }
        },
        componentUpdated: function (el, binding, vnode) {
          el.onloadstart = function (ev) {
          }
          el.ondurationchange = function (ev) {
          }
          el.onloadedmetadata = function (ev) {
          }
          el.onloadeddata = function (ev) {
          }
          el.onprogress = function (ev) {
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
            vnode.context.musicControl.volume.value = parseInt(ev.target.volume * 100)
            vnode.context.musicControl.play = !ev.target.paused
          }
          el.oncanplaythrough = function (ev) {
          }
          el.onended = function (ev) {
            vnode.context.afterPlayEnd()
            vnode.context.$refs.bgMusic.play()
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
      },
      'getAudioDuration': {
        inserted: function (el, binding, vnode) {
          let _audio = document.createElement('audio')
          _audio.src = binding.value
          _audio.oncanplay = function (ev) {
            el.innerHTML = ev.target.duration
            let _value = parseInt(ev.target.duration)
            el.innerHTML = (parseInt(_value / 60) < 10 ? ('0' + parseInt(_value / 60)) : parseInt(_value / 60)) + ':' + ((_value % 60) < 10 ? ('0' + (_value % 60)) : (_value % 60))
          }
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
  .pen {
    pointer-events: none;
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
          text-shadow: 0 1px 0 #171717;
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
        color: #999;
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
          a.play {
            background-position: 0 -204px;
            margin: 0 8px;
            &:hover {
              background-position: -40px -204px;
            }
          }
          a.pause {
            background-position: 0 -165px;
            margin: 0 8px;
            &:hover {
              background-position: -40px -165px;
            }
          }
          a.next {
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
              text-shadow: 0 1px 0 #171717;
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
                color: #797979;
                text-shadow: 0 1px 0 #121212;
                .current-time {
                  color: #a1a1a1;
                }
                .duration {
                  color: #797979;
                }
              }
            }
          }
          a.volume, a.volume-muted {
            position: relative;
            width: 25px;
            height: 25px;
            .volume-settings {
              position: absolute;
              width: 32px;
              /*height: 113px;*/
              left: -3.5px;
              top: 44px;
              padding: 8px 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: rgba(66, 66, 66, 0.96);
            }
          }
          a.volume {
            background-position: -2px -248px;
            &:hover {
              background-position: -31px -248px;
            }
          }
          a.volume-muted {
            background-position: -104px -69px;
            &:hover {
              background-position: -126px -69px;
            }
          }
          a.loop-all {
            width: 25px;
            height: 25px;
            background-position: -3px -344px;
            margin-left: 8px;
            &:hover {
              background-position: -33px -344px;
            }
          }
          a.loop-shuffle {
            width: 25px;
            height: 25px;
            margin-left: 8px;
            background-position: -66px -248px;
            &:hover {
              background-position: -93px -248px;
            }
          }
          a.loop-one {
            width: 25px;
            height: 25px;
            margin-left: 8px;
            background-position: -66px -344px;
            &:hover {
              background-position: -93px -344px;
            }
          }
          a.list {
            position: relative;
            width: 58px;
            height: 25px;
            padding-left: 21px;
            margin-left: 8px;
            background-position: -42px -68px;
            line-height: 27px;
            text-align: center;
            color: #666;
            text-shadow: 0 1px 0 #080707;
            text-indent: 0;
            text-decoration: none;
            &:hover {
              background-position: -42px -98px;
            }
            .music-list-container {
              position: fixed;
              width: 500px;
              height: 350px;
              right: 0;
              top: 44px;
              cursor: auto;
              border: 1px solid rgba(0, 0, 0, 0.3);
              background-color: #424242;
              -moz-user-select:none;
              -webkit-user-select:none;
              user-select:none;
              .list-header {
                position: relative;
                width: 100%;
                height: 40px;
                line-height: 40px;
                color: #ffffff;
                text-align: left;
                padding-left: 15px;
                font-weight: bold;
                background-color: #333;
                cursor: auto;
                text-shadow: 0 1px 0 #000;
                border-bottom: 1px solid rgba(0, 0, 0, 0.3);
                .close {
                  position: absolute;
                  top: 0;
                  font-weight: normal;
                  color: #999;
                }
              }
              .list-main {
                width: 100%;
                height: 298px;
                margin: 5px 0;
                overflow-x: hidden;
                overflow-y: auto;
                .list-item {
                  width: 100%;
                  text-align: left;
                  padding: 0 15px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  color: #ddd;
                  &:hover {
                    background-color: #333;
                    color: #42b983;
                  }
                  &.active {
                    background-color: #333;
                    color: #42b983;
                  }
                  .operation {
                    width: 90px;
                    display: inline-flex;
                    justify-content: flex-end;
                    i {
                      pointer-events: auto;
                    }
                  }
                  .play-icon {
                    pointer-events: none;
                    width: 20px;
                    text-align: center;
                  }
                  .name {
                    width: calc(60% - 90px);
                    padding: 0 5px;
                    text-align: left;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;
                    pointer-events: none;
                  }
                  .author {
                    width: calc(40% - 20px - 40px);
                    text-align: left;
                    padding-left: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;
                    pointer-events: none;
                  }
                  .duration {
                    width: 80px;
                    text-align: right;
                  }
                }
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
