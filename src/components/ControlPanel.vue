<template lang="pug">
#control-panel.control-panel
  .app-options(
    :class="{'gray': app.running && !app.paused}"
    @click.stop
    v-if="!isMobile"
    )
    svg.optionsIcon(
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 19.454 20"
      )
      path(
        d="M19.43,12.98A7.793,7.793,0,0,0,19.5,12a7.793,7.793,0,0,0-.07-.98l2.11-1.65a.5.5,0,0,0,.12-.64l-2-3.46a.5.5,0,0,0-.61-.22l-2.49,1a7.306,7.306,0,0,0-1.69-.98l-.38-2.65A.488.488,0,0,0,14,2H10a.488.488,0,0,0-.49.42L9.13,5.07a7.683,7.683,0,0,0-1.69.98l-2.49-1a.488.488,0,0,0-.61.22l-2,3.46a.493.493,0,0,0,.12.64l2.11,1.65A7.931,7.931,0,0,0,4.5,12a7.931,7.931,0,0,0,.07.98L2.46,14.63a.5.5,0,0,0-.12.64l2,3.46a.5.5,0,0,0,.61.22l2.49-1a7.306,7.306,0,0,0,1.69.98l.38,2.65A.488.488,0,0,0,10,22h4a.488.488,0,0,0,.49-.42l.38-2.65a7.683,7.683,0,0,0,1.69-.98l2.49,1a.488.488,0,0,0,.61-.22l2-3.46a.5.5,0,0,0-.12-.64ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
        transform="translate(-2.271 -2)"
        )
    .custom-select.arrow( @click.stop="optionsClicked()" ) Options
    transition( name="select-options" )
      .app-options-panel( v-if="selectingOptions" )
        span.exit-icon( @click="selectingOptions = false" )
        .app-options-choice.option-keyboard-color
          span.label keyboard color
          ul
            li(
              :class="[!grayScale && 'selected']"
              @click.stop="toggleKbColor()"
              ) Fingers
            li(
              :class="[grayScale && 'selected']"
              @click.stop="toggleKbColor()"
              ) Grayscale
        .app-options-choice.option-app-theme
          span.label app theme
          ul
            li(
              :class="{'selected': app.theme === 'dark'}"
              @click.stop="setAppTheme('dark')"
              ) Dark
            li(
              :class="{'selected': app.theme === 'light'}"
              @click.stop="setAppTheme('light')"
              ) Light

        .app-options-choice
          button.show-result-btn.orange-border.dotted-border.orange(@click="setDisplayResult(true)") Show my results
  .time.custom-select.arrow.blue.tooltip( @click.stop='displayTime = !app.running ? true : false' ) {{timeLabel}}
    .tooltip-text allotted time
    transition( name='select-options' )
      ul.select-options-panel( v-if="displayTime" )
        li.select-option(
          v-for="n in 5"
          :key="n"
          :value="n"
          @click.stop="getTime"
          :class="n*60 === time.allotted && 'selected'"
          ) {{n}} {{n === 1 ? 'min' : 'mins'}}
        input.time-input.blue-border.dotted-border(
          type="number" min="0" max="60" :placeholder="time.allotted/60 +` ${time.allotted/60 === 1 ? 'min' : 'mins'}`"
          @keyup.enter="getTime")
        span.exit-icon( @click.stop="displayTime = false" )
  .speed.tooltip
    .tooltip-text words per minute
    span( v-if="!app.running && !app.beforeRestart" ) {{text.speed}}
    AnimatedNumber(
      v-else
      :value="speed"
      unit=""
      )
  .error.red.tooltip
    .tooltip-text error rate
    span( v-if="!app.running && !app.beforeRestart" ) {{text.error}}
    AnimatedNumber(
      v-else
      :value="error"
      unit="%"
      )
  TypingModeControl(v-if="!isMobile")
</template>

<script>
import TypingModeControl from "./TypingModeControl.vue";
import AnimatedNumber from "./AnimatedNumber.vue";
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  name: "ControlPanel",
  components: {
    TypingModeControl,
    AnimatedNumber
  },
  data() {
    return {
      text: { time: "time", speed: "wpm", error: "error" },
      selecting: false,
      displayTime: false,
      selectingOptions: false
    };
  },
  methods: {
    ...mapMutations({
      toggleKbColor: "TOGGLE_KB_COLOR",
      setTimeAllotted: "SET_TIME_ALLOTTED",
      setDisplayOptions: "SET_DISPLAY_OPTIONS",
      setAppTheme: "SET_APP_THEME",
      toggleTypingMode: "TOGGLE_TYPING_MODE",
      setDisplayResult: "SET_DISPLAY_RESULT"
    }),
    optionsClicked() {
      this.selectingOptions =
        !this.app.running || this.app.paused ? true : false;
    },
    getTime(event) {
      this.displayTime = false;
      this.selecting = false;
      this.setTimeAllotted(
        event.target.value >= 60 ? 60 * 60 : event.target.value * 60
      );
    }
  },
  computed: {
    ...mapState({
      time: "time",
      speed: "speed",
      error: "error",
      app: "app",
      grayScale: "grayScale",
      byWord: "byWord"
    }),
    ...mapGetters({
      isMobile: "isMobile"
    }),
    timeString() {
      return `${("0" + Math.floor(this.time.left / 60)).slice(-2)}:${(
        "0" +
        (this.time.left % 60)
      ).slice(-2)}`;
    },
    timeLabel() {
      return !this.app.running && this.time.left === 0
        ? this.text.time
        : this.timeString;
    }
  },
  mounted() {
    window.addEventListener(
      "click",
      event => {
        this.displayTime = false;
        this.selectingOptions = false;
      },
      false
    );
  }
};
</script>

<style lang="sass">
#control-panel
  width: auto
  text-align: center
  min-width: 30rem
  white-space: nowrap
  &>div
    display: inline-block
    margin: 0 1rem
  .time-input
    display: block
    text-align: center
    margin: auto
    height: 2rem
    width: 5rem
    border-radius: 5px
    background: none
  .app-options
    .app-options-choice
      margin: 0
      .show-result-btn
        height: 2.5rem
        width: 8.5rem
        border-width: 3px
        background: none
        margin: auto
        margin-top: 1rem
        border-radius: 5px
        display: block
    svg
      position: absolute
      left: 0
      top: 50%
      transform: translateY(-50%)
      height: 1rem
      width: 1rem
      transition: fill 200ms ease
    .custom-select
      padding-left: 20px
      display: inline-block
  .time, .speed, .error
    text-transform: uppercase
    font-size: 1.5rem
    width: 6rem
    text-align: center
    border-radius: 5px
    border: dotted 3px currentColor
    &.arrow:after
      right: 7.5px
    .select-options-panel
      text-transform: lowercase
  .speed, .error
    cursor: default
</style>
