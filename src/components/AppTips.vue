<template lang="pug">
transition(name="select-options" appear)
  .app-tips(v-if="showTip")
    span.exit-icon(@click="showTip = false")
    .tip-icon
      svg.bulb(
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 20"
        )
        path(
          class="bulb-icon"
          d="M9,21a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V20H9ZM12,2A7,7,0,0,0,8,14.74V17a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14.74A7,7,0,0,0,12,2Zm2.85,11.1-.85.6V16H10V13.7l-.85-.6a5,5,0,1,1,5.7,0Z"
          transform="translate(-5 -2)"
          )
      span Tips!

    .tip-content
      slot
</template>

<script>
export default {
  name: "AppTips",
  data() {
    return {
      showTip: true
    };
  }
};
</script>

<style lang="sass">
.app-tips
  position: absolute
  border-radius: 10px
  height: auto
  width: 20rem
  padding: 20px
  box-shadow: 1px 3px 10px rgba(#000000, 0.16)
  text-align: left
  .bulb
    height: 1.5rem
    width: auto
    display: inline-block
    vertical-align: top
  .tip-icon span
    color: #ffa845
    font-weight: bold
    margin-left: 1rem
  .tip-content
    margin: 20px 0
    margin-left: 20px
  .bulb-icon
    fill: #ffa845
</style>
