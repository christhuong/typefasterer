<template lang="pug">
transition(name="notification" key="note" appear)
  .app-notification(v-if="displayNotification" :class="classObj") {{notification.message}}
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'AppNotification',
  methods: {
    ...mapMutations({
      clearNotification: 'CLEAR_NOTIFICATION'
    })
  },
  computed: {
    ...mapState({
      notification: 'notification'
    }),
    classObj() {
      return {
        warning: this.notification.type === 'warning',
        error: this.notification.type === 'error',
        success: this.notification.type === 'success',
        primary: this.notification.type === 'primary',
      }
    },
    displayNotification() {
      return this.notification.display;
    }
  },
  watch: {
    displayNotification() {
      if (this.displayNotification) {
        setTimeout(() => {
          this.clearNotification();
        }, 5000)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.app-notification
  opacity: 1
  display: block
  position: fixed
  bottom: 0
  left: 50%
  transform: translateX(-50%)
  padding: 3rem 2rem
  border-radius: 5px 5px 0 0
  height: auto
  width: 80vw
  pointer-events: none
  font-size: 1.5rem
.notification-enter-active
  transition: all .3s ease
.notification-leave-active
  transition: all .3s ease
.notification-leave-to, .notification-enter
  transform: translate(-50%, 100%)
</style>
