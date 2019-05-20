<template lang='pug'>
#home
  .header
  AppTextDisplay
  ControlPanel
  AppScreen
  AppControlButtons
</template>

<script>
// @ is an alias to /src
import AppTextDisplay from '@/components/AppTextDisplay.vue';
import ControlPanel from '@/components/ControlPanel.vue';
import AppControlButtons from '@/components/AppControlButtons.vue';
import AppScreen from '@/components/AppScreen.vue';
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'home',
  components: {
    ControlPanel,
    AppTextDisplay,
    AppScreen,
    AppControlButtons,
  },
  methods: {
    ...mapMutations({
      changeAppMode: 'CHANGE_APP_MODE'
    })
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
  grid-template-areas: 'header' 'display' 'panel' 'screen' 'footer'
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
  .app-screen
    grid-area: screen
    align-self: center
    justify-self: center
    display: grid
    align-items: center
    justify-items: center
    width: 100%
    height: 100%
  .app-control-buttons
    grid-area: footer
</style>
