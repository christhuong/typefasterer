<template lang="pug">
.about
  main
    section.grid-2
      figure
        img(:src="src1" alt="keyboard picture")
      div
        h1.blue You can type very fast
        h2 You can type 60 words or even more in a minute with 10 fingers after about 60 hours training!
        p
          span.about-num.blue 60#[span hours<br>training]
          span.about-num.green-text 60#[span words<br>per&nbsp;minute]
    section.grid-2
      figure
        img(:src="src2" alt="keyboard picture")
      div
        h1.blue Type faster with 10 fingers
        h2 You can type with your ten fingers! <br>Each of yours is in charge of pressing designated keys.<br>When you are used to typing with this technique, you can press the correct key without even looking at the keyboard.
    section.grid-2
      figure
        img(src="../assets/graph.png" alt="line graph")
      div
        h1.blue The more you practice, the faster you type!
        h2 At the first 10 hours, you may find yourself typing slowly and this may discourage you. <br> However, if you keep practicing, you will make great progress in no time!
    section.grid-3
      h1.blue We can help you type faster
      h2 Type fasterer app can help you type 60 words per minute by providing diverse practice mode and tracking your typing progress for you.
        span.cat.green-text Visit our #[a(href="https://www.facebook.com/typefasterer/" target="_blank") fanpage] for typing tips!
      .fasterer
        a(href="https://www.facebook.com/typefasterer/" target="_blank")
          .text fast
            span.blinking.guide &nbsp;&nbsp;
  footer
    p Designed and crafted with ❤️ and ☕ by #[a(href="https://www.facebook.com/christhuong98/" target="_blank") Chris Thuong]
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "about",
  computed: {
    ...mapState({
      app: "app"
    }),
    src1() {
      return this.app.theme === "light"
        ? require("../assets/mobile_keyboard_light.png")
        : require("../assets/mobile_keyboard_dark.png");
    },
    src2() {
      return this.app.theme === "light"
        ? require("../assets/kb_light.png")
        : require("../assets/kb_dark.png");
    }
  }
};
</script>

<style lang="sass">
.about
  position: relative
  main
    margin: 2rem auto
    text-align: left
    display: grid
    grid-auto-rows: 90vh
    grid-template-columns: 1fr
    grid-gap: 2rem
    align-content: center
    justify-content: center
    align-items: center
    justify-items: center
  section
    position: relative
    width: 100%
    max-width: 50rem
  h1
    font-size: 2rem
  h2
    font-weight: normal
    font-size: 1.25rem
  figure
    width: 100%
    max-width: 40rem
    height: auto
    padding: 1rem
    display: grid
    align-content: center
    img
      display: block
      width: 100%
      height: auto
  .grid-2
    display: grid
    height: 100%
    grid-template-columns: 1fr
    grid-template-rows: 1fr 1fr
    grid-row-gap: 2rem
    align-content: center
    justify-content: center
    align-items: center
    grid-template-areas:  'div-2' 'fig-2'
    text-align: center
    figure
      justify-self: center
      align-self: start
      grid-area: fig-2
    div
      width: 100%
      justify-self: center
      align-self: end
      grid-area: div-2
    h1
      margin: 1rem 0
    p
      position: relative
      &:after
        content: ''
        display: block
        position: absolute
        height: 0
        width: 0
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        border: solid 0.5rem transparent
        border-left-color: #cecece
  .about-num
    font-size: 2.5rem
    font-weight: bold
    position: relative
    margin: 0 3rem
    span
      position: relative
      font-weight: normal
      font-size: 1rem
      text-align: left
      display: inline-block
      margin-left: 1rem
  .grid-3
    height: auto
    display: grid
    grid-template-columns: 1fr
    grid-template-rows: 1fr 2fr 4fr
    grid-gap: 1rem
    align-content: center
    justify-content: center
    align-items: center
    justify-items: center
    grid-template-areas: 'h1-3' 'h2-3' 'fasterer-3'
    text-align: center
    h1
      grid-area: h1-3
    h2
      grid-area: h2-3
    .cat
      margin: 1rem auto
      display: block
    .fasterer
      display: grid
      align-content: center
      justify-content: center
      grid-area: fasterer-3
      position: relative
      height: 100%
      width: 100%
      .text
        position: relative
        font-size: 3rem
        font-weight: bold
      .guide
        position: relative
        &:before
          content: ''
          display: block
          position: absolute
          z-index: 0
          height: 100%
          width: 100%
          top: 0
          left: 0
          border-radius: 3px
      .blinking:before
        animation: blink 1s ease infinite
  footer
    width: 100%
    text-align: center
    position: absolute
    bottom: 0
</style>
