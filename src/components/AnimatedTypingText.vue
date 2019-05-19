<template lang="pug">
.animated-typing-text {{typingText}}
</template>

<script>
export default {
  name: 'AnimatedTypingText',
  data() {
    return {
      index: 0,
      typingText: '',
      speed: 30,
    }
  },
  props: {
    text: {
      type: String,
      required: true,
    }
  },
  methods: {
    typeWriter() {
      if (this.index < this.text.length) {
        this.typingText += this.text.charAt(this.index)
        this.index++;
        setTimeout(this.typeWriter, this.speed);
      }
    },
  },
  watch: {
    text() {
      this.index = 0;
      this.typingText = '',
      this.typeWriter();
    }
  },
  mounted() {
    this.typeWriter();
  },
}
</script>

<style lang="sass">

</style>
