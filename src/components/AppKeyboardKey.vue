<template lang="pug">
.app-keyboard-key(:class="classObject")
  span
    slot
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'AppKeyboardKey',
  props: {
    index: Number,
    lastIndex: Number
  }, 
  computed: {
    classObject() {
      if (this.lastIndex === 6) {
        return {
        'fin-thumb': this.index === 3,
        'active-finger': this.index === 3,
        'fin-baby': this.index !==3,
        'align-left': this.index === 0,
        'align-right': this.index === this.lastIndex
        }
      } else {
        return {
        'fin-baby': this.index < 2 || this.index > 9,
        'fin-ring': this.index === 2 || this.index === 9,
        'fin-middle': this.index === 3 || this.index === 8,
        'fin-index-left': this.index === 4 || this.index === 5,
        'fin-index-right': this.index === 6 || this.index === 7,
        'align-left': this.index === 0,
        'align-right': this.index === this.lastIndex,
        'uppercase': this.index > 0 && this.index < 11 && this.uppercase
        }
      }
    },
    ...mapState({
      uppercase: 'uppercaseOn'
    })
  }
}
</script>

<style lang="sass">
@import '../sass/_1_plugins/_colors'
.app-keyboard-key
  display: grid
  position: relative
  text-align: center
  font-size: 0.8rem
  width: 100%
  height: 100%
  margin: auto
  border-radius: 5px
  box-shadow: 3px 3px 10px rgba($black, 0.15)
  transition: all 300ms ease
  span
    color: inherit
    position: relative
    display: block
    margin: auto    
    z-index: 1
  &.fin-baby
    border-color: $green
    box-shadow: 0px 0px 10px rgba($green, 0.3)
    &.active, &.shift-active
      color: $green
  &.fin-ring
    border-color: $orange
    box-shadow: 0px 0px 10px rgba($orange, 0.3)
    &.active
      color: $orange
  &.fin-middle
    border-color: $pink
    box-shadow: 0px 0px 10px rgba($pink, 0.3)
    &.active
      color: $pink
  &.fin-index-left
    border-color: $blue-light
    box-shadow: 0px 0px 10px rgba($blue-light, 0.3)
    &.active
      color: $blue-light
  &.fin-index-right
    border-color: $blue
    box-shadow: 0px 0px 10px rgba($blue, 0.3)
    &.active 
      color: $blue
  &.fin-thumb
    border-color: $yellow
    box-shadow: 0px 0px 10px rgba($yellow, 0.3)
    &.active
      color: $yellow
.app-keyboard-key.active, .app-keyboard-key.shift-active
  background-color: currentColor
  span 
    color: $black
.pressed
  transition: all 100ms ease
  opacity: 0.3

.app-keyboard-key
  border: solid 1px $dark-gray
  background-color: $black
  color: $white
.gray .app-keyboard-key, .light .gray .app-keyboard-key
  &.active, &.shift-active
    &:after
      content: ''
      display: block
      position: absolute
      height: 100%
      width: 100%
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      border: solid 2px $green
      border-radius: 5px
      background: none
      color: $green-text
.gray .app-keyboard-key
  border-color: $dark-gray
  box-shadow: 3px 3px 10px rgba($black, 0.15)
  &.active, &.shift-active
    border-color: $green
    color: $white
    background-color: $black
    span
      color: $green-text
.light .app-keyboard-key
  background-color: $white
  color: $black
  &.active, &.shift-active
    background-color: currentColor
.light .gray .app-keyboard-key
  border-color: $light-border
  &.active, &.shift-active
    color: $green-text
    background-color: $white
.align-left
  &>span
    text-align: left
    margin-left: 10px
.align-right
  &>span
    text-align: right
    margin-right: 10px
.uppercase
  text-transform: uppercase

.app-keyboard-key.fin-thumb.active-finger span
  color: $light-green
  font-weight: bold
</style>
