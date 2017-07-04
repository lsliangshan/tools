<template>
  <div id="joke-box" title="讲个段子" v-ls-drag data-after="dragAfter" data-before="dragBefore">
    <i class="fa fa-fw play-joke" :class="playing ? 'fa-pause' : 'fa-play'" @click="playJoke"></i>
  </div>
</template>

<script>
  import * as types from '../../store/mutation-types'
  import '../../../static/js/jquery.ui.min'
  export default {
    data () {
      return {
        jokes: [],
        jokeContainerStyle: {
        },
        body: {
          width: 0,
          height: 0
        },
        playing: false
      }
    },
    computed: {
      theme () {
        return this.$store.state.theme
      }
//      ,
//      body () {
//        return {
//          width: $(window).width(),
//          height: $(window).height()
//        }
//      }
    },
    created () {
      const that = this

      that.body = {
        width: $(window).width(),
        height: $(window).height()
      }

      window.onresize = function () {
        that.body = {
          width: $(window).width(),
          height: $(window).height()
        }
      }

      $.ajax({
        async: false,
        url: that.$store.state.requestUrl + '/index/getJokes',
        dataType: 'jsonp',
        success: function (res) {
          that.jokes = res

//          that.playJoke(res[Math.floor(Math.random() * res.length)])
        }
      })

//      var utterThis = new window.SpeechSynthesisUtterance('老师发现小明上课时老是讲话，生气地说：“小明，你要是再不老实，我就告诉你爸爸。”       小明十分冷静地说：“老师，其实我对你也不满意，我却从来没有告诉过你爸爸。”');
//      var utterThis = new window.SpeechSynthesisUtterance('        ');

//      window.speechSynthesis.speak(new window.SpeechSynthesisUtterance('“小明，你将来想找一份什么样的工作？” '));
//      window.speechSynthesis.speak(new window.SpeechSynthesisUtterance('“钱多事少离家近！”'));
//      window.speechSynthesis.speak(new window.SpeechSynthesisUtterance('“那是怎样的一份工作呢？”'));
//      window.speechSynthesis.speak(new window.SpeechSynthesisUtterance('“在小区门口摆个碗，月收入过万！”'));
//      window.speechSynthesis.speak(new window.SpeechSynthesisUtterance('“滚出去”'));

//      window.speechSynthesis.speak(new window.SpeechSynthesisUtterance('老师我喜欢你'));
//
//      window.speechSynthesis.speak(new window.SpeechSynthesisUtterance('我不喜欢小孩'));
//      window.speechSynthesis.speak(new window.SpeechSynthesisUtterance('我也不喜欢小孩，我们可以不要小孩'));
//
//
//      window.speechSynthesis.speak(new window.SpeechSynthesisUtterance('滚出去'));
    },
    methods: {
      playJoke () {
        this.playing = true
        let joke = this.jokes[Math.floor(Math.random() * this.jokes.length)]
        for (let i = 0; i < joke.length; i++) {
          window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(joke[i]));
        }
        this.playing = false
      },
      dragBefore (event, ui) {
        event.target.style.webkitTransition = ''
        event.target.style.mozTransition = ''
        event.target.style.oTransition = ''
        event.target.style.transition = ''
      },
      dragAfter (event, ui) {
        let _w = $(window).width()
        if (ui.offset.left <= _w / 2) {
          event.target.style.left = 0
        } else if (ui.offset.left > _w / 2) {
          event.target.style.left = (_w - 48) + 'px'
        }
        event.target.style.webkitTransition = 'all .3s cubic-bezier(0.215,.61,.355,1)'
        event.target.style.mozTransition = 'all .3s cubic-bezier(0.215,.61,.355,1)'
        event.target.style.oTransition = 'all .3s cubic-bezier(0.215,.61,.355,1)'
        event.target.style.transition = 'all .3s cubic-bezier(0.215,.61,.355,1)'
      }
    },
    components: {
    },
    directives: {
      'lsDrag': {
        inserted: function (el, binding, vnode) {
          let _w = $(window).width()
          let _h = $(window).height()
          $(el).draggable({
            start: vnode.context[vnode.elm.dataset.before],
            stop: vnode.context[vnode.elm.dataset.after],
            containment: [-10, 48, _w - 38, _h - 48]
          })
        }
//        ,
//        componentUpdated: function (el, binding, vnode) {
//          console.log('component updated')
//          let _w = $(window).width()
//          let _h = $(window).height()
//          $(el).draggable({
//            start: vnode.context[vnode.elm.dataset.before],
//            stop: vnode.context[vnode.elm.dataset.after],
//            containment: [-10, 48, _w - 38, _h - 48]
//          })
//        }
      }
    }
  }
</script>

<style scoped lang="scss">
  #joke-box {
    position: fixed;
    right: 0;
    top: 200px;
    width: 48px;
    height: 48px;
    z-index: 99999;
    border-radius: 5px;
    cursor: pointer;
    background-color: #e5e5e5;
    background: url('http://fdfs.xmcdn.com/group27/M03/17/2E/wKgJR1jjBnSzX7eqAAVMqSeBxhY969_web_large.jpg') 100% 100% no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    /*-webkit-transition: all .3s cubic-bezier(0.215,.61,.355,1);*/
    /*-moz-transition: all .3s cubic-bezier(0.215,.61,.355,1);*/
    /*-ms-transition: all .3s cubic-bezier(0.215,.61,.355,1);*/
    /*-o-transition: all .3s cubic-bezier(0.215,.61,.355,1);*/
    /*transition: all .3s cubic-bezier(0.215,.61,.355,1);*/
    .play-joke {
      font-size: 26px;
      color: #ffffff;
      width: 20px;
      /*margin-left: 4px;*/
      &:hover {
        color: rgb(66, 185, 131);
      }
    }
  }
</style>
