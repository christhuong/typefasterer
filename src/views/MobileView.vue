<template lang="pug">
#mobile
  .fasterer
      a(href="https://www.facebook.com/typefasterer/" target="_blank")
        .text fast 
          span.blinking.guide &nbsp;&nbsp;
  p.announce.dotted-border.blue-border Hello there! <br> We're working on a #[span(class="bold blue") mobile version] for this app and will release it #[span(class="bold blue") very soon!] <br> Follow #[a(href="https://www.facebook.com/typefasterer/" target="_blank" class="bold green") our fanpage] to get latest updates!
  p.brand Designed and crafted with ❤️ and ☕ by<br>#[a(href="https://www.facebook.com/christhuong98/" target="_blank") Chris Thuong]
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'MobileView',
  computed: {
    ...mapState({
      app: 'app'
    }),
    src() {
      return this.app.theme === 'light' ? require('../assets/mobile_keyboard_light.png') : require('../assets/mobile_keyboard_dark.png')
    }
  }
}
</script>

<style lang="sass" scoped>
#mobile
  height: 100vh
  width: 100vw
  position: relative
  overflow: hidden
  display: grid
  grid-template-rows: 1fr 3fr 1fr
  grid-template-columns: 1fr
  grid-template-areas: 'logo' 'announce' 'brand'
  grid-gap: 1.5rem
  justify-content: center
  align-items: center
  justify-items: center
  .fasterer
    // background-color: none
    background-size: contain
    background-repeat: no-repeat
    background-position: center
    display: grid
    grid-area: logo
    align-content: center
    justify-content: center
    position: relative
    height: 100%
    width: 100%
    .text
      position: relative
      font-size: calc(2vw + 2vh + 2rem)
      font-weight: bold
    .guide
      position: relative
      &:before
        content: ''
        display: block
        position: absolute
        z-index: 0
        height: 100%
        width: 100%
        top: 0
        left: 0
        border-radius: 3px
    .blinking:before
      animation: blink 1s ease infinite
.brand
  grid-area: brand
.announce
  font-size: 1.25rem
  grid-area: announce
  width: 80vw
  text-align: center
  z-index: 2
  padding: 20px 10px
  border-radius: 10px
  border-width: 5px
.mobile-kb-pic
  grid-area: announce
  width: 120vw
  height: auto
  z-index: 0
</style>
