<template lang="pug">
#typing-mode-control.typing-mode-control
  .custom-select.arrow.tooltip(
    @click.stop='handleClick'
    :class="{'gray': app.running && !app.paused}"
    ) {{capitalize(typingMode)}}

    .tooltip-text typing modes
    transition(name='select-options')
      ul.select-options-panel(v-if="displayOptions")
        li.select-option(
          v-for="m in typingModes"
          :key="m"
          @click.stop="getMode"
          :class="m.toLowerCase() === typingMode && 'selected'"
          ) {{capitalize(m)}}
        span.exit-icon(@click.stop="setDisplayOptions(false)")
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "AppTimer",
  data() {
    return {
      displayText: true
    };
  },
  methods: {
    handleClick() {
      if (this.app.running && !this.app.paused) return;
      this.setDisplayOptions(!this.displayOptions);
    },
    getMode(event) {
      this.displayText = false;
      this.setTypingMode(event.target.textContent.toLowerCase());
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    ...mapMutations({
      setTypingMode: "SET_TYPING_MODE",
      setDisplayOptions: "SET_DISPLAY_OPTIONS"
    })
  },
  computed: {
    ...mapState({
      typingModes: "typingModes",
      typingMode: "typingMode",
      app: "app",
      displayOptions: "displayOptions"
    })
  }
};
</script>

<style lang="sass">
#typing-mode-control
  position: relative
  width: auto
  text-align: center
  white-space: nowrap
  .custom-select
    transition: color 200ms ease
    width: 6rem
    .select-options-panel
      right: -150%
</style>
