<template lang="pug">
.app-loading(v-if="displayLoading")
  .loading-content.blue Please wait a second ...
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "AppLoading",
  computed: {
    ...mapState({
      displayLoading: "displayLoading"
    })
  }
};
</script>

<style lang="sass" scoped>
.app-loading
  display: block
  height: 100vh
  width: 100vw
  position: fixed
  top: 0
  left: 0
  pointer-events: none
  .loading-content
    font-size: 5rem
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
</style>
