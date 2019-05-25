<template lang='pug'>
#home
  .header
  AppTextDisplay
  ControlPanel
  TypingMode(v-if="displayTypingMode")
  ResultDisplay(v-else-if="displayResult")
  AppKeyboard(v-else-if="!isMobile")
  AppControlButtons
  TypingModeControl(v-if="isMobile")
</template>

<script>
// @ is an alias to /src
import AppTextDisplay from '@/components/AppTextDisplay.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import AppControlButtons from '@/components/AppControlButtons.vue'
import TypingModeControl from '@/components/TypingModeControl.vue'
import AppKeyboard from '@/components/AppKeyboard.vue'
import ResultDisplay from '@/components/ResultDisplay.vue'
import TypingMode from '@/components/TypingMode.vue'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'home',
  components: {
    ControlPanel,
    AppTextDisplay,
    AppKeyboard,
    AppControlButtons,
    TypingModeControl,
    TypingMode,
    ResultDisplay,
  },
  methods: {
    ...mapMutations({
      changeAppMode: 'CHANGE_APP_MODE'
    })
  },
  computed: {
    ...mapState({
      displayResult: 'displayResult',
      displayOptions: 'displayOptions',
    }),
    ...mapGetters({
      isMobile: 'isMobile',
    }),
    displayTypingMode() {
      return !this.displayResult && this.displayOptions;
    },
  },
  mounted() {
    this.changeAppMode('practice');
  }
}
</script>

<style lang="sass">
#home
  height: 100vh
  width: 100vw
  margin: 0
  padding: 0
  display: grid
  align-content: center
  justify-content: center
  grid-template-rows: 2fr 3fr 1fr 5fr 3fr
  grid-template-columns: 1fr
  grid-template-areas: 'header' 'display' 'panel' 'screen' 'btns'
  grid-gap: 1rem
  .app-text-display
    grid-area: display
    align-self: center
    justify-self: center
  .control-panel
    grid-area: panel
    justify-self: center
    align-self: end
    justify-content: center
    align-content: center
  .app-keyboard, .typing-mode, .result-display
    grid-area: screen
  .app-control-buttons
    grid-area: btns
  .typing-mode-control
    grid-area: mode
    align-self: start
    justify-self: center
</style>
