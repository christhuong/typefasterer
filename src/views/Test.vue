<template lang="pug">
#test(:class="{'test-mode': app.mode !== 'practice'}")
  .head
  AnimatedTypingText(:text="cheer").cheer(v-if="!isMobile")
  TypingMode(v-if="displayTypingMode")
  AppTextDisplay(v-else-if="!displayResult")
  ResultDisplay(v-else)
  ControlPanel
  AppControlButtons
  TypingModeControl(v-if="isMobile")
</template>

<script>
import AppTextDisplay from "@/components/AppTextDisplay.vue";
import ControlPanel from "@/components/ControlPanel.vue";
import AppControlButtons from "@/components/AppControlButtons.vue";
import ResultDisplay from "@/components/ResultDisplay.vue";
import TypingMode from "@/components/TypingMode";
import AnimatedTypingText from "@/components/AnimatedTypingText.vue";
import TypingModeControl from "@/components/TypingModeControl.vue";
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  name: "test",
  components: {
    AnimatedTypingText,
    AppTextDisplay,
    ControlPanel,
    AppControlButtons,
    ResultDisplay,
    TypingMode,
    TypingModeControl
  },
  methods: {
    ...mapMutations({
      changeAppMode: "CHANGE_APP_MODE"
    })
  },
  computed: {
    ...mapState({
      app: "app",
      displayResult: "displayResult",
      displayOptions: "displayOptions"
    }),
    ...mapGetters({
      isMobile: "isMobile"
    }),
    displayTypingMode() {
      return !this.displayResult && this.displayOptions;
    },
    cheer() {
      if (!this.app.running && !this.app.beforeRestart)
        return `How fast can you type?`;
      if (!this.app.running && this.app.beforeRestart)
        return `You can type even faster than this!`;
      return "Try not to look at your keyboard while typing";
    }
  },
  created() {
    this.changeAppMode("test");
  }
};
</script>

<style lang="sass">
#test
  height: 100vh
  width: 100vw
  margin: 0
  padding: 0
  display: grid
  grid-template-rows: 2fr 3fr 1fr 5fr 3fr
  grid-template-columns: 1fr
  grid-template-areas: 'header' 'cheer' 'panel' 'display' 'btns'
  grid-gap: 1rem
  align-content: center
  justify-content: center
  .cheer
    grid-area: cheer
    font-size: 1.75rem
    align-self: center
    justify-self: center
  .control-panel
    grid-area: panel
    align-self: end
    justify-self: center
  .app-text-display
    grid-area: display
    justify-self: center
    align-self: center
  .result-display
    grid-area: display
    justify-self: center
    align-self: end
  .app-control-buttons
    grid-area: btns
  .typing-mode-control
    grid-area: mode
    align-self: start
    justify-self: center
</style>
