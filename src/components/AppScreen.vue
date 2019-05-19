<template lang="pug">
#app-screen.app-screen
  // transition-group(name='screen')
  AppKeyboard(
    v-if="displayKeyboard" 
    key="screen-kb"
    )
  TypingMode(
    v-if="displayTypingMode" 
    key="screen-type"
    )
  ResultDisplay(
    v-if="displayResult" 
    key="screen-result"
    )
  // typing-mode
</template>

<script>
import AppKeyboard from './AppKeyboard.vue';
import TypingMode from './TypingMode.vue';
import ResultDisplay from './ResultDisplay.vue';
import {mapState, mapMutations} from 'vuex';

export default {
  name: 'AppScreen',
  components: {
    AppKeyboard,
    TypingMode,
    ResultDisplay
  },
  computed: {
    ...mapState({
      displayOptions: 'displayOptions',
      displayResult: 'displayResult'
    }),
    displayKeyboard() {
      return !this.displayResult && !this.displayTypingMode;
    },
    displayTypingMode() {
      return !this.displayResult && this.displayOptions;
    }
  }
}
</script>

<style lang="sass">
#app-screen
  display: grid
  place-content: center
.screen-enter-active
  transition: all .5s ease
.screen-leave-active
  // position: absolute
  transition: all .5s ease
.screen-leave-to, .screen-enter
  opacity: 0
  // position: absolute
</style>
