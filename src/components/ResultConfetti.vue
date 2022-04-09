<template lang="pug">
#result-confetti.result-confetti(ref='confetti')
  .confetti__bit(
    v-for="bit in numberOfConfetti"
    :style="[confettiBitStyle()]"
    :key='bit'
    )
</template>

<script>
class Confetti {
  constructor(el) {
    this.el = el;
    this.done = false;
    this.startPos = { x: 0, y: 0 };
  }
  transform(x = 0, y = 0, angle = 0) {
    this.el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle}deg)`;
  }
  reset() {
    this.done = false;
    this.startPos.x =
      ((1 - Math.round(Math.random()) * 2) * window.innerWidth) / 2;
    this.startPos.y = window.innerHeight / 2;
    this.x = this.startPos.x;
    this.y = this.startPos.y;
    this.v = 5 + Math.random() * 2;
    this.gravity = 0.1 + 0.08 * Math.random();
    this.angle = 0;
    this.dx =
      window.innerWidth < window.innerHeight
        ? 3 + Math.random() * 2
        : 4 + Math.random() * 4;
    this.dy = -8;
    this.da = 2 + Math.random() * 2;
  }
  update() {
    this.y += this.v * this.dy + this.dy;
    this.angle += this.da;
    if (Math.abs(this.y) > window.innerHeight / 2) this.done = true;
    if (this.startPos.x < 0) {
      this.x += this.v * this.dx + this.dx;
    } else {
      this.x -= this.v * this.dx + this.dx;
    }
    this.dy += this.gravity;
    this.v += -0.2 * this.v;
    this.transform(this.x, this.y, this.angle);
  }
}

export default {
  name: "ResultConfetti",
  data() {
    return {
      numberOfConfetti: 20,
      colors: [
        "#00afd7",
        "#9bf0e1",
        "#ff5f5f",
        "#40ff40",
        "#f573a0",
        "#ffa845"
      ],
      bits: [],
      raf: null
    };
  },
  methods: {
    confettiBitStyle() {
      let borderRadius = Math.round(Math.random()) * 50;
      let width = 0.5 + Math.random() * 1;
      let height = borderRadius === 0 ? 0.5 + Math.random() * 0.5 : width;
      return {
        borderRadius: `${borderRadius}%`,
        backgroundColor: this.colors[
          Math.floor(Math.random() * this.colors.length)
        ],
        width: `${width}rem`,
        height: `${height}rem`
      };
    },
    init() {
      this.bits = this.confettiBits.map(bit => new Confetti(bit));
      this.bits.map(bit => bit.reset());
    },
    relaunch() {
      this.bits.map(bit => bit.reset());
      this.raf = window.requestAnimationFrame(this.animate);
    },
    animate() {
      this.bits.map(bit => bit.update());
      if (this.bits.every(bit => bit.done)) {
        window.cancelAnimationFrame(this.raf);
        this.relaunch();
        return;
      }
      this.raf = window.requestAnimationFrame(this.animate);
    }
  },
  computed: {
    confettiBits() {
      return [...this.$refs.confetti.children];
    }
  },
  mounted() {
    // console.log(this.confettiBits);
    this.init();
    this.raf = window.requestAnimationFrame(this.animate);
  }
};
</script>

<style lang="sass">
#result-confetti
  height: 100vh
  width: 100vw
  position: fixed
  top: 0
  left: 0
  user-select: none
  pointer-events: none
  .confetti__bit
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    position: absolute
    height: 1rem
    border-radius: 50%
</style>
