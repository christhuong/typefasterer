<template lang="pug">
#app-text-display.app-text-display(:class="{'test-mode': app.mode === 'test', 'screen-children-size': app.mode === 'test'}" )
  .time-progress-bar(v-if="app.mode !=='practice'")
    .time-bar-inner(:style='{transform: `scaleX(${app.running ? 1 - time.left/time.allotted : 0})`}')
  h1(v-if="!app.running && app.mode === 'practice'")
    span.thin {{animatedText0}}
    span.bold.blue {{animatedText1}}
    span.guide.blinking &nbsp;&nbsp;
  h1(v-else v-html="modifiedText")
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "AppTextDisplay",
  data() {
    return {
      defaultText: `<span class='thin'>Welcome to</span> <span class="bold blue">type fasterer</span> <span class="guide blinking">&nbsp&nbsp</span>`,
      scrolltop: 0,
      guideParent: "",
      welcomeText: ["Welcome to ", "Type Fasterer "],
      welcomeIndex: [0, 0],
      animatedText0: "",
      animatedText1: ""
    };
  },
  methods: {
    ...mapMutations({
      setText: "SET_TEXT"
    }),
    adjustScroll() {
      if (this.guideParent === "") return false;
      if (this.guideRect().bottom >= this.parentRect().bottom) {
        this.guideParent.scrollTop += this.guideRect().height;
        return;
      }
      if (this.guideRect().bottom <= this.parentRect().top) {
        this.guideParent.scrollTop -= this.guideRect().height;
      }
    },
    guideRect() {
      return document.querySelector(".guide")
        ? document.querySelector(".guide").getBoundingClientRect()
        : {};
    },
    parentRect() {
      if (!document.querySelector("#app-text-display h1")) return {};
      this.guideParent = document.querySelector("#app-text-display h1");
      return this.guideParent.getBoundingClientRect();
    },
    typeWriter(no) {
      if (no !== 0 && no !== 1) return;
      if (this.welcomeIndex[no] < this.welcomeText[no].length) {
        if (no === 0)
          this.animatedText0 += this.welcomeText[no].charAt(
            this.welcomeIndex[no]
          );
        if (no === 1)
          this.animatedText1 += this.welcomeText[no].charAt(
            this.welcomeIndex[no]
          );
        this.welcomeIndex[no]++;
        setTimeout(() => this.typeWriter(no), 30);
      } else {
        if (no === 1) return;
        this.typeWriter(1);
      }
    }
  },
  computed: {
    ...mapState({
      index: "currentChar",
      text: "textToType",
      errorArr: "errorIndices",
      app: "app",
      time: "time",
      defaultTestText: "defaultText"
    }),
    modifiedText() {
      if (!this.guideRect().bottom && this.guideParent !== "")
        this.guideParent.scrollTop = 0;
      let tempText = this.text.split("").map((el, i) => {
        let guide = i === this.index ? "guide" : "";
        let mistake = this.errorArr.includes(i) ? "wrong-char" : "";
        let space = el === " " && (!!guide || !!mistake) ? "space" : "";
        return !!guide || !!mistake
          ? `<span class="${space} ${mistake} ${guide}" >${el}</span>`
          : el;
      });
      if (this.index > 0) {
        tempText[0] = `<span class='gray'>${tempText[0]}`;
        tempText[this.index] = `</span>${tempText[this.index]}`;
      }
      return tempText.join("");
    }
  },
  watch: {
    text() {
      if (this.guideParent) this.guideParent.scrollTop = 0;
    }
  },
  mounted() {
    if (this.app.mode === "test" && this.text === "")
      this.setText(this.defaultTestText);
    this.guideParent = document.querySelector("#app-text-display h1");
    this.guideParent.scrollTop = 0;
    this.typeWriter(0);
  },
  updated() {
    this.adjustScroll();
  },
  beforeDestroy() {
    this.guideParent = null;
  }
};
</script>

<style lang="sass">
@import '../sass/components/_app-text-display'
#app-text-display
  margin: 0
  position: relative
  z-index: 0
  display: grid
  align-content: center
  justify-content: center
  height: 5.8rem
  width: 48vw
  min-width: 36rem
  border-radius: 10px
  h1
    font-weight: 400
    text-align: left
    overflow-y: auto
    margin: 1.5rem
    .bold
      font-weight: bold
  .thin
    font-weight: 400

  .guide
    position: relative
    &:before
      content: ''
      display: block
      position: absolute
      z-index: -1
      height: 100%
      width: 100%
      top: 0
      left: 0
      border-radius: 3px
  .blinking:before
    animation: blink 1s ease infinite
  .wrong-char
    position: relative
    &.space:not(.guide):after
      content: ''
      display: block
      position: absolute
      height: 2px
      bottom: 0
      left: 0
#app-text-display.test-mode
  border-radius: 5px
  text-align: left
  padding: 0
  box-sizing: border-box
  h1
    height: auto
    text-align: left
    font-weight: normal
    overflow-y: auto
    margin: 1.5rem
</style>
