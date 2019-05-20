<template lang='pug'>
#app-keyboard.screen-children-size.app-keyboard(:class="[grayScale && 'gray']")
  .time-bar.time-bar-outer
    .time-bar-inner(:style='{transform: `scaleX(${app.running ? 1 - time.left/time.allotted : 0})`}')
  .keyboard__rows
    template(v-for="(row, rowName) in enKeys")
      div(:class="`keyboard__${String(rowName)}`" :key="`row${String(rowName)}`")
        template(v-if="displaySymbols")
          AppKeyboardKey(
            v-for="(key, index) in row.shift" 
            :index="index" 
            :lastIndex="row.all.length - 1" 
            :key="`key${key}${index}`"
            :class="keyStateClass(key, row.all[index])"
            ) {{key === ' ' ? activeFinger : key}}
        template(v-else)
          AppKeyboardKey(
            v-for=" (key, index) in row.all" 
            :index="index" 
            :lastIndex="row.all.length - 1" 
            :key="`key${key}${index}`" 
            :class="keyStateClass(key, row.shift[index])"
            ) {{key === ' ' ? activeFinger : key}}
</template>

<script>
import AppKeyboardKey from './AppKeyboardKey.vue'
import { mapState } from 'vuex';
export default {
  name: 'AppKeyboard',
  components: {
    AppKeyboardKey
  },
  data() {
    return {
      enKeys: {
        numberRow: {
          all: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=' ,'back'],
          shift: ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'back']
        },
        topRow: {
          all: ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']' ,'\\'],
          shift: ['tab','q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p','{', '}', '|']
        },
        homeRow: {
          all: ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter'],
          shift: ['caps','a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',':',`"`,'enter']
        },
        bottomRow: {
          all: ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'],
          shift: ['shift','z', 'x', 'c', 'v', 'b', 'n', 'm','<', '>', '?','shift']
        },
        spaceRow: {
          all: ['ctrl', 'fn', 'alt', ' ', 'alt', 'me', 'ctrl'],
          shift: ['ctrl', 'fn', 'alt', ' ', 'alt', 'me', 'ctrl']
        }
      }
    }
  },
  methods: {
    keyStateClass(key, alias) {
      return {
        'active': this.activeKeys.includes(key.toLowerCase()) || this.activeKeys.includes(alias.toLowerCase()),
        'pressed': this.pressedKeys.includes(key.toLowerCase()),
        'shift-active': this.shiftKeyActive && key === 'shift'
      }
    }
  },
  computed: {
    ...mapState({
      app: 'app',
      time: 'time',
      grayScale: 'grayScale',
      activeKeys: 'activeKeys',
      pressedKeys: 'pressedKeys',
      shiftKeyActive: 'shiftKeyActive',
      displaySymbols: 'displaySymbols',
      activeFinger: 'activeFinger'
    })
  }
}
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
.keyboard__numberRow
  grid-template-columns: repeat(13, 1fr) 2fr
.keyboard__topRow
  grid-template-columns: 1.8fr repeat(12, 1fr) 1.2fr
.keyboard__homeRow
  grid-template-columns: 2.2fr repeat(11, 1fr) 1.8fr
.keyboard__bottomRow
  grid-template-columns: 2.5fr repeat(10, 1fr) 2.5fr
.keyboard__spaceRow
  grid-template-columns: 1.5fr 1fr 1.5fr 7fr 1.5fr 1fr 1.5fr
</style>
