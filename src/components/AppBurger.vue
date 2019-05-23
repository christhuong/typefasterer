<template lang="pug">
#app-burger.app-burger(@click.stop)
  transition( name="select-options" )
    .app-options-panel( v-if="displayBurger" )
      span.exit-icon( @click="setDisplayBurger(false)" )

      //User not logged in
      .app-options-choice(v-if="!userLogIn")
        span.label you are not logged in
        .user-btns
          button.user-btn.gray-border.solid-border.signup-btn(
            @click="buttonClicked('/signup')"
            ) Sign up
          button.user-btn.login-btn.green-border.green-text.solid-border(
            @click="buttonClicked('/login')"
            class="selected"
            ) Log in

      //User logged in
      .app-options-choice(v-else)
        span.label you are logged in with
        .user-info.blue
          .name {{currentUser.email}}
          button.user-btn.logout-btn.solid-border.red.red-border(
            @click="logOut()"
            ) Log out

      .app-options-choice.theme-choice.gray-border.solid-border
        span.label app theme
        ul
          li(
            :class="{'selected': app.theme !== 'light'}" 
            @click.stop="setAppTheme('dark')"
            ) Dark
          li(
            :class="{'selected': app.theme === 'light'}" 
            @click.stop="setAppTheme('light')"
            ) Light
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import firebase from 'firebase/app';
import 'firebase/auth'
export default {
  name: 'AppBurger',
  data() {
    return {
    }
  },
  methods: {
    ...mapMutations({
      setAppTheme: 'SET_APP_THEME',
      setDisplayBurger: 'SET_DISPLAY_BURGER',
      notify: 'NOTIFY',
    }),
    buttonClicked(path = '/signin') {
      this.$router.push(path);
      this.setDisplayBurger(false);
    },
    logOut() {
      firebase.auth().signOut().then(() => {
        this.notify({type: 'success', message: 'You are logged out!'})
        // this.$router.push('/')
      })
    }
  },
  computed: {
    ...mapState({
      app: 'app',
      displayBurger: 'displayBurger',
      userLogIn: 'userLogIn',
      currentUser: 'currentUser'
    })
  },
  mounted() {
    window.addEventListener('click', () => this.setDisplayBurger(false))
  }
}
</script>

<style lang="sass">
#app-burger
  position: absolute
  width: 18rem
  right: 7.14vw
  top: 1rem
  .app-options-panel
    top: 0
    left: 0
    position: absolute
  .app-options-choice
    .user-info
      display: grid
      grid-template-rows: 1fr 2fr
      grid-template-columns: 1fr
      grid-gap: 0.5rem
      align-content: center
      justify-content: center
      align-items: center
      justify-items: center
    .name
      align-self: start
      justify-self: start
      max-width: 12rem
      overflow: hidden
      text-overflow: ellipsis
    .user-btns
      margin-top: 0.5rem
      display: grid
      grid-template-rows: 1fr
      grid-template-columns: 1fr 1fr
      grid-gap: 0.5rem
      align-content: center
      justify-content: center
      align-items: center
      justify-items: center
    .user-btn
      height: 2.5rem
      width: 6rem
      padding: 0 0.5rem
      border-radius: 5px
      font-size: 1rem
      background: none
      vertical-align: middle
      text-align: center
      margin: 0
      cursor: pointer
      border-width: 1px
</style>
