<template>
  <div class="page">
    <div @click="showSideMenu">
      <md-button class="md-icon-button">
        <md-icon>menu</md-icon>
      </md-button>
    </div>
    <img class="logo" src="../../../static/img/logo01.PNG">
    <com-music></com-music>
    <com-joke></com-joke>
    <!--<h2 class="md-title app-name" v-text="appName"></h2>-->
    <md-tabs :md-theme="theme" class="zi99" md-right md-elevation="10" @change="tabChanged">
      <!--<md-tab md-label="base64" md-tooltip="base64加解密">-->
        <!--<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas amet cum vitae, omnis! Illum quas voluptatem, expedita iste, dicta ipsum ea veniam dolore in, quod saepe reiciendis nihil.</p>-->
      <!--</md-tab>-->

      <!--<com-json></com-json>-->
      <!--<com-base64></com-base64>-->
      <!--<com-color></com-color>-->
      <!--<com-letters></com-letters>-->

      <span v-for="(item, index) in tabs" :key="item">
        <com-json v-if="item=='json'"></com-json>
        <com-base64 v-if="item=='base64'"></com-base64>
        <com-color v-if="item=='color'"></com-color>
        <com-letters v-if="item=='letters'"></com-letters>
      </span>

      <!--<md-tab md-icon="favorite">-->
        <!--<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas amet cum vitae, omnis! Illum quas voluptatem, expedita iste, dicta ipsum ea veniam dolore in, quod saepe reiciendis nihil.</p>-->
        <!--<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas amet cum vitae, omnis! Illum quas voluptatem, expedita iste, dicta ipsum ea veniam dolore in, quod saepe reiciendis nihil.</p>-->
      <!--</md-tab>-->

      <!--<md-tab md-icon="near_me">-->
        <!--<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas.</p>-->
      <!--</md-tab>-->
    </md-tabs>
  </div>
</template>

<script>
  import ComBase64 from '../../components/pages/ComBase64.vue'
  import ComColor from '../../components/pages/ComColor.vue'
  import ComJson from '../../components/pages/ComJson.vue'
  import ComMusic from '../../components/pages/ComMusic.vue'
  import ComJoke from '../../components/pages/ComJoke.vue'
  import ComLetters from '../../components/pages/ComLetters.vue'

  export default {
    name: 'home',
    data () {
      return {
        tabs: [
          'json', 'base64', 'color', 'letters'
        ]
      }
    },
    computed: {
      appName () {
        return this.$store.state.appName
      },
      theme () {
        return this.$store.state.theme
      }
    },
    methods: {
      showSideMenu () {
        this.$parent.showSideMenu()
      },
      hideSideMenu () {
        this.$parent.hideSideMenu()
      },
      tabChanged (idx) {
        this.$router.replace('#' + this.tabs[idx])
      }
    },
    components: {
      ComBase64,
      ComColor,
      ComJson,
      ComMusic,
      ComJoke,
      ComLetters
    }
  }
</script>

<style lang="scss">
  .zi99 {
    z-index: 99;
  }
  .page {
    width: 100%;
    height: 100%;
    .logo {
      position: absolute;
      left: 52px;
      top: 0;
      height: 48px;
      z-index: 999;
    }
    .app-name {
      flex: 1;
      position: absolute;
      left: 160px;
      top: 0;
      color: #fff;
      z-index: 999;
      line-height: 48px;
    }
    .md-tabs {
      height: 100%;
      .md-tabs-content {
        height: calc(100% - 48px)!important;
      }
    }
    .md-icon-button {
      position: absolute;
      color: #fff;
      z-index: 999;
      margin-top: 4px;
    }
  }

  .md-tooltip {
    z-index: 999999;
  }
</style>
