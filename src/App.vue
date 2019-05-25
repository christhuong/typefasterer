<template>
  <div id="app" v-bind:class="{'light': app.theme === 'light', 'mobile': isMobile}">
    <div id="nav">
      <router-link id='logo' to="/about">fasterer</router-link>
      <router-link to="/test">Test</router-link>
      <router-link to="/">Practice</router-link>
      <router-link to="/stats">Stats</router-link>
      <div id='menu-ham' @click.stop="setDisplayBurger(true)">
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
      <app-burger/>
    </div>
    <router-view/>
    <app-notification/>
    <app-loading/>
    <app-tips class="app-tip-main" v-if="showTips">
      Do you have an account yet? <br> 
      <a @click="setDisplayTips(false)" href="/signup" class="bold blue underline">Sign up</a> or <a @click="setDisplayTips(false)" href="/login" class="bold blue underline">Log in</a> now to save your typing data and get access to it everywhere!
    </app-tips>
  </div>
</template>
<script>
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
import AppBurger from './components/AppBurger.vue'
import AppNotification from './components/AppNotification.vue'
import AppLoading from './components/AppLoading.vue'
import AppTips from './components/AppTips.vue'
export default {
  components: {
    AppBurger,
    AppNotification,
    AppLoading,
    AppTips,
  },
  methods: {
    ...mapMutations({
      updateAppTheme: 'UPDATE_APP_THEME',
      setDisplayBurger: 'SET_DISPLAY_BURGER',
      setDisplayTips: 'SET_DISPLAY_TIPS',
    }),
    ...mapActions({
      userObserver: 'userObserver'
    }),
    
  },
  computed: {
    ...mapState({
      app: 'app',
      userLogIn: 'userLogIn',
      displayTips: 'displayTips',
    }),
    ...mapGetters({
      isMobile: 'isMobile'
    }),
    showTips() {
      return (!this.userLogIn && this.displayTips);
    },
  },
  created() {
    this.updateAppTheme();
    document.getElementById('theme-color').setAttribute('content', this.app.theme === 'light' ? '#eaeaea' : '#000000')
    this.userObserver();
  },
}
</script>

<style lang="sass">
@import './sass/_styles'
#app
  height: 100vh
  width: 100vw
  font-family: $opensans
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  margin: 0
  padding: 0
  overflow-x: hidden
.app-tip-main
  position: absolute
  top: 30%
  left: 55%
  z-index: 99
  
#logo
  position: absolute
  left: 7.14vw
  top: 50%
  transform: translateY(-50%)
  font-family: $opensans
  font-weight: bold
  font-size: 1.2rem
  cursor: pointer
#menu-ham
  position: absolute
  display: block
  width: 15px
  height: 12px
  right: 7.14vw
  top: 50%
  transform: translateY(-50%)
  cursor: pointer
  .bar
    position: absolute
    height: 4px
    right: 0
    &:first-child
      top: 0
      width: 10px
    &:last-child
      bottom: 0
      width: 15px
#nav
  padding: 0
  margin: 0
  position: fixed
  width: 100%
  top: 0
  z-index: 99
  a
    padding: 15px 10px
    margin: 0 10px
    display: inline-block
    &.router-link-exact-active
      color: $green-text
      font-weight: bold
      &:after
        content: ''
        position: absolute
        display: block
        height: 5px
        width: 100%
        background-color: $green
        top: 0
        left: 0

#app
  transition: background-color 200ms ease
  background-color: $dark
#app.light
  background-color: $light

#logo
  color: $dark-text
#menu-ham
  .bar
    background-color: $dark-text
#nav
  background-color: transparent
  background-image: linear-gradient(to bottom, $dark, transparent)
  a
    color: $dark-text
    &.router-link-exact-active
      color: $green-text
.light
  #logo
    color: $light-text
  #menu-ham
    .bar
      background-color: $light-text
  #nav
    background-image: linear-gradient(to bottom, $light, transparent)
    a
      color: $light-text
      &.router-link-exact-active
        color: $green-text
</style>
