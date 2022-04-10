<template lang="pug">
#app-keyboard.screen-children-size.app-keyboard(:class="[grayScale && 'gray']")
  .time-bar.time-bar-outer
    .time-bar-inner(:style='{transform: `scaleX(${app.running ? 1 - time.left/time.allotted : 0})`}')
  .keyboard__rows
    template(v-for="(row, rowName) in keys")
      div(:class="`keyboard__${rowName}`" :key="`row${rowName}`")
        template(v-if="displaySymbols")
          AppKeyboardKey(
            v-for="(key, index) in row.SHIFTED"
            :index="index"
            :lastIndex="row.SHIFTED.length - 1"
            :key="`key${key}${index}`"
            :class="keyStateClass(key, row.UNSHIFTED[index])"
            ) {{key === ' ' ? activeFinger : key}}
        template(v-else)
          AppKeyboardKey(
            v-for=" (key, index) in row.UNSHIFTED"
            :index="index"
            :lastIndex="row.UNSHIFTED.length - 1"
            :key="`key${key}${index}`"
            :class="keyStateClass(key, row.SHIFTED[index])"
            ) {{key === ' ' ? activeFinger : key}}
</template>

<script>
import { mapState } from "vuex";
import AppKeyboardKey from "./AppKeyboardKey.vue";
import { EN_KEYBOARD_KEYS } from "../data/keyboard";

export default {
  name: "AppKeyboard",
  components: {
    AppKeyboardKey
  },
  data() {
    return { keys: EN_KEYBOARD_KEYS };
  },
  methods: {
    keyStateClass(key, alias) {
      return {
        active:
          this.activeKeys.includes(key.toLowerCase()) ||
          this.activeKeys.includes(alias.toLowerCase()),
        pressed: this.pressedKeys.includes(key.toLowerCase()),
        "shift-active": this.shiftKeyActive && key.toLowerCase() === "shift"
      };
    }
  },
  computed: {
    ...mapState({
      app: "app",
      time: "time",
      grayScale: "grayScale",
      activeKeys: "activeKeys",
      pressedKeys: "pressedKeys",
      shiftKeyActive: "shiftKeyActive",
      displaySymbols: "displaySymbols",
      activeFinger: "activeFinger"
    })
  }
};
</script>

<style lang="sass">
#app-keyboard
  font-family: 'Open Sans', sans-serif
  padding: 10px
  margin: auto
  border-radius: 0 0 5px 5px
  transition: background-color 200ms ease
  position: relative
  &.test-mode
    display: none
.keyboard__rows
  height: 100%
  width: 100%
  margin-bottom: 10px
  display: grid
  grid-template-rows: repeat(5, 1fr)
  grid-template-columns: 1fr
  grid-gap: 3.2%
  min-height: 0
  align-items: stretch
  justify-items: stretch
  align-content: stretch
  justify-items: stretch
  &>div
    display: grid
    grid-template-rows: 1fr
    grid-gap: 1.1%
.keyboard__NUMBER_ROW
  grid-template-columns: repeat(13, 1fr) 2fr
.keyboard__TOP_ROW
  grid-template-columns: 1.8fr repeat(12, 1fr) 1.2fr
.keyboard__HOME_ROW
  grid-template-columns: 2.2fr repeat(11, 1fr) 1.8fr
.keyboard__BOTTOM_ROW
  grid-template-columns: 2.5fr repeat(10, 1fr) 2.5fr
.keyboard__SPACE_ROW
  grid-template-columns: 1.5fr 1fr 1.5fr 7fr 1.5fr 1fr 1.5fr
</style>
