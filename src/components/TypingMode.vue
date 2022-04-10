<template lang="pug">
#typing-mode.typing-mode.screen-children-size( @click.stop="handleClick" )
  .byKeyboard( v-if="mode === `keyboard`" )
    template( v-for="(row, rowName) in textData.KEYBOARD" )
      label.custom-input( :key="rowName" )
        input(
          type="checkbox"
          :id="row"
          v-model="chosenMode"
          :value="row.join('')"
          )
        span.checkmark
        span.samples {{capitalize(rowName + ' row')}}
        span.samples.spacing {{row.join('')}}
  .byHand( v-if="mode === `hand`" )
    .hand(
      v-for="(hand, handName) in textData.HAND"
      :key="handName"
      )
      label.custom-input
        input(
          type="checkbox"
          :checked="allChosen(hand)"
          @click="toggleAll(hand)"
          )
        span.checkmark
        span.samples {{capitalize(handName + ' hand')}}
      template( v-for="(row, rowName) in hand" )
        label.custom-input( :key="`hand${rowName}`" )
          input(
            type="checkbox"
            v-model="chosenMode"
            :value="row.join('')"
            )
          span.checkmark
          span.samples.spacing {{row.join('')}}
  .byCustom( v-if="mode === 'custom'" )
    textarea(
      placeholder="Enter your own text to practice"
      v-model="chosenMode[0]"
    )
  p.required( v-if="chosenMode.length===0" ) {{ requiredError }}
  button.set-text.blue.blue-border.solid-border(
    :class="{'disabled': chosenMode.length===0}"
    @click="setChosenText()"
    :disabled="chosenMode.length===0"
    ) Set text
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { TYPING_MODE_KEY_MAP } from "../data/keyboard";

export default {
  name: "TypingMode",
  data() {
    return {
      chosenMode: [],
      textData: TYPING_MODE_KEY_MAP
    };
  },
  methods: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
    },
    handleClick() {
      return false;
    },
    allChosen(hand) {
      return Object.values(hand)
        .map(el => el.join(""))
        .every(el => this.chosenMode.includes(el));
    },
    toggleAll(hand) {
      if (this.allChosen(hand)) {
        this.chosenMode = this.chosenMode.filter(
          el =>
            !Object.values(hand)
              .map(row => row.join(""))
              .includes(el)
        );
      } else {
        this.chosenMode.push(
          ...Object.values(hand)
            .map(row => row.join(""))
            .filter(el => !this.chosenMode.includes(el))
        );
      }
    },
    setChosenText() {
      this.setText(this.textAfterShuffled);
      this.setDisplayOptions(false);
    },
    ...mapMutations({
      setText: "SET_TEXT",
      setDisplayOptions: "SET_DISPLAY_OPTIONS"
    }),
    setLocalText() {
      for (let item in this.typingText) {
        this.textData[item] = this.typingText[item];
      }
    }
  },
  computed: {
    ...mapState({
      enAllKeys: "enAllKeys",
      mode: "typingMode",
      textToType: "textToType",
      typingText: "typingText",
      enAllKeys: "enAllKeys"
    }),
    requiredError() {
      return this.mode === "custom"
        ? "* Type something in the box"
        : "* Check at least one box";
    },
    textAfterShuffled() {
      const filterText = arrOfChars =>
        arrOfChars.filter(char => this.enAllKeys.includes(char.toLowerCase()));
      let text = "";
      const shuff = arr =>
        arr.reduce((_, cur, index, self) => {
          const i = self.length - index - 1;
          const j = Math.floor(Math.random() * i);
          cur = self[i];
          self[i] = self[j];
          self[j] = cur;
          return self;
        }, []);
      if (this.mode === "custom") {
        text = this.chosenMode
          .join(" ")
          .replace(/[\r\s\n]/g, " ")
          .split("");
        text = filterText(text);
      } else if (this.mode === "sentences") {
        text = shuff(
          this.chosenMode
            .join("$$")
            .replace(/[\r\s\n]/g, " ")
            .split("$$")
        );
      } else {
        text =
          this.chosenMode.join(" ").split(" ").length === this.chosenMode.length
            ? filterText(this.chosenMode.join("").split(""))
            : this.chosenMode;
        let times =
          this.chosenMode.join(" ").split(" ").length === this.chosenMode.length
            ? 3
            : 1;
        text = shuff(
          text
            .join(" ")
            .replace(/[\r\s\n]/g, " ")
            .split(" ")
        )
          .map(el => el.repeat(times))
          .join(" ")
          .split("");
      }
      return text.join("").trim();
    }
  },
  watch: {
    mode() {
      this.chosenMode = [];
    }
  },
  mounted() {
    this.setLocalText();
  }
};
</script>

<style lang="sass">
#typing-mode
  border-radius: 5px
  padding: 20px
  margin: auto
  display: grid
  justify-content: center
  align-content: stretch
  position: relative
  &>div
    display: grid
    margin: auto
    align-content: center
    justify-content: center
.byKeyboard
  grid-template-columns: 1fr
  grid-template-rows: repeat(5, 1fr)
  grid-gap: 0.5rem
  width: 20rem
  min-width: 20rem
  label
    padding: 0
    display: grid
    grid-template-columns: 1fr 3fr 6fr
    grid-template-rows: 1fr
    grid-template-areas: '. sample samplespacing'
    justify-items: start
    &>.samples
      grid-area: sample
    .samples.spacing
      grid-area: samplespacing
.byWords
  grid-gap: 0.5rem
  .words
    width: auto
    text-align: left
.byHand
  grid-template-columns: 1fr 1fr
  grid-template-rows: 1fr
  grid-gap: 0 2rem
  width: 20rem
  .hand
    display: grid
    grid-gap: 0 2rem
    grid-template-columns: 1fr
    grid-template-rows: 2fr repeat(5, 1fr)
    align-content: center
    justify-content: center
    align-items: center
.checkmark
  &.radio
    border-radius: 50%
.required
  width: auto
  white-space: nowrap
  position: absolute
  top: 0.5rem
  left: 50%
  transform: translate(-50%, 0)
.byCustom
  width: 20rem
  textarea
    padding: 10px
    border-radius: 5px
    border: 1px dotted #ccc
    font-size: 1rem
    height: 8rem
    width: 25rem
.set-text
  display: block
  cursor: pointer
  position: absolute
  bottom: 0
  right: 0
  background: none
  transform: translate(-1rem, -1rem)
  transition: color 200ms ease
.samples
  transition: color 200ms ease
  &.spacing
    letter-spacing: 0.3rem
</style>
