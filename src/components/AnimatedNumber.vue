<template lang="pug">
  span {{ tweeningValue.toFixed(1) }}{{unit}}
</template>
<script>
import { TweenLite } from "gsap";
export default {
  name: "AnimatedNumber",
  props: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      tweeningValue: 0
    };
  },
  watch: {
    value(newValue) {
      this.tween(newValue);
    }
  },
  mounted() {
    this.tween(this.value);
  },
  methods: {
    tween(newValue) {
      new TweenLite.to(this.$data, 0.5, { tweeningValue: newValue });
    }
  }
};
</script>
