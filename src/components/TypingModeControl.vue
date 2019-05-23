<template lang="pug">
#typing-mode-control
  .custom-select.arrow.tooltip(
    @click.stop='handleClick' 
    :class="{'gray': app.running && !app.paused}"
    ) {{typingMode.charAt(0).toUpperCase() + typingMode.slice(1).toLowerCase()}}

    .tooltip-text typing modes
    transition(name='select-options')
      ul.select-options-panel(v-if="displayOptions")
        li.select-option(
          v-for="m in modes" 
          :key="m" 
          @click.stop="getMode" 
          :class="m.toLowerCase() === typingMode && 'selected'"
          ) {{m}}
        span.exit-icon(@click.stop="setDisplayOptions(false)")
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
  name: 'AppTimer',
  data() {
    return {
      displayText: true,
      modes: ['Keyboard', 'Hand', 'Words', 'Sentences', 'Custom']
    }
  },
  methods: {
    handleClick() {
      if (this.app.running && !this.app.paused) return;
      this.setDisplayOptions(true);
    },
    getMode(event) {
      this.displayText = false;
      this.setTypingMode(event.target.textContent.toLowerCase());
    },
    ...mapMutations({ 
      setTypingMode: 'SET_TYPING_MODE',
      setDisplayOptions: 'SET_DISPLAY_OPTIONS'
    })
  },
  computed: {
    ...mapState({
      typingMode: 'typingMode',
      app: 'app',
      displayOptions: 'displayOptions'
    }),
  }
}
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
