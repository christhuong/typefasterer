<template lang='pug'>
#stats.stats
  //- .fact(v-html="fact")
  .result
    .total-time.blue
      .value.tooltip {{`0${Math.floor(totalTime/60/60)}`.slice(-2)}}#[sup h]{{`0${Math.round((totalTime/60)%60)}`.slice(-2)}}#[sup m]
        .tooltip-text Your total<br>practice time
      .label total practice time
    .average-speed.green-text
      .value.tooltip 
        .tooltip-text The higher the better
        animated-number(:value="averageSpeed")
      .label words per minute
    .average-error.red
      .value.tooltip 
        .tooltip-text Good if lower than 5%
        animated-number(:value="averageError" :unit="'%'")
      .label average error rate 
  .time-bar-wrapper
    .result-label(
      :style="timeBarLabelStyle"
      v-html="timeBarLabelText")
    .time-progress-bar
      .time-progress-bar-inner(:style="timeBarStyle")
  transition(name="select-options")    
    AppTips(v-if="statsResults.length <= 0") Your results and insights will be displayed here

  .graph#graph
    .result-cells-container
      .result-lines
        div(:style="lineClass(0)" :data-content="`${Math.round(averageTime/60)}'`")
        div(:style="lineClass(1)" :data-content="`${Math.round(averageSpeed)}`")
        div(:style="lineClass(2)" :data-content="`${Math.round(averageError)}%`")
      .result-cell(v-for="(arr, name, index) in refinedStatsData")
        .result-label
          div {{Math.round(arr[0]/60)}}m
          div {{arr[1]}}
          div {{arr[2]}}%
        .date-row {{name.split(" ")[2]}}
          sup {{name.split(' ')[1]}}
        .result-col.time-col(:style="styleClass(0, arr)")
        .result-col.speed-col(:style="styleClass(1, arr)")
        .result-col.error-col(:style="styleClass(2, arr)")

</template>

<script>
import AnimatedNumber from '../components/AnimatedNumber.vue'
import AppTips from '../components/AppTips.vue'
import {mapState, mapMutations, mapActions} from 'vuex'
export default {
  name: 'stats',
  components: {
    AnimatedNumber,
    AppTips,
  },
  methods: {
    ...mapActions({
      updateStatsData: 'updateStatsData'
    }),
    ...mapMutations({
      notify: 'NOTIFY',
    }),
    styleClass(name, arr) {
      let data = name === 0 ? this.maxTime : (name === 1 ? this.maxSpeed : this.maxError);
      return {
        transform: `scaleY(${arr.length > 0 && data > 0 ? arr[name]/data : 0})`
      }
    },
    lineClass(name) {
      let aver = name === 0 ? this.averageTime : (name === 1 ? this.averageSpeed : this.averageError);
      let max = name === 0 ? this.maxTime : (name === 1 ? this.maxSpeed : this.maxError);
      return {
        bottom: `${(aver/max)*100}%`
      }
    },
  },
  computed: {
    ...mapState({
      statsResults: 'statsResults',
      statsData: 'statsData',
    }),
    totalTime() {
      return this.statsData ? [...Object.values(this.statsData)].map(el => el[0]).reduce((acc, cur) => acc + cur, 0) : 0;
    },
    averageTime() {
      let len = Object.keys(this.statsData).length;
      return len > 0 ? this.totalTime/len : 0;
    },
    averageSpeed() {
      let speed = this.statsResults.length > 0 ? this.statsResults.map(el => parseInt(el[2])).reduce((acc, cur) => acc + cur, 0)/this.statsResults.length : 0;
      return Math.round(speed*100)/100
    },
    averageError() {
      let error = this.statsResults.length > 0 ? this.statsResults.map(el => parseInt(el[3])).reduce((acc, cur) => acc + cur, 0)/this.statsResults.length : 0;
      return Math.round(error*100)/100
    },
    maxTime() {
      return this.statsData ? Math.max(...[...Object.values(this.statsData)].map(el => el[0])) : 0;
    },
    maxSpeed() {
      let speed = this.statsResults.length > 0 ? Math.max(...this.statsResults.map(el => parseInt(el[2]))) : 0;
      return speed;
    },
    maxError() {
      let error = this.statsResults.length > 0 ? Math.max(...this.statsResults.map(el => parseInt(el[3]))) : 0;
      return error;
    },
    timeBarStyle() {
      return {
        transform: `scaleX(${this.totalTime/(60*60*60)})`
      }
    },
    timeBarLabelStyle() {
      return {
        left: `${100*this.totalTime/(60*60*60)}%`,
      }
    },
    timeBarLabelText() {
      let lefttime = 60*60*60 - this.totalTime;
      let hours = `0${Math.floor(lefttime/60/60)}`.slice(-2);
      let minutes = `0${Math.round((lefttime/60)%60)}`.slice(-2);
      return `
      <p>
      <span class="bold blue">${hours}:${minutes}</span> left to <br> type <span class="green-text">60</span> wpm
      </p>`
    },
    refinedStatsData() {
      const f = obj => {
        const k = 86400000;
        let t;
        let temp = Object.keys(obj)
        .map(el => new Date(el).getTime())
        .sort((a, b) => b - a)
        .reduce((acc, cur, i, self) => i ? acc.concat([...Array(Math.ceil(Math.abs(cur - self[i - 1]))/k).keys()].map(el => cur + (el + 1)*k)) : [cur], [])
        .reduce((acc, cur) => (t = new Date(cur).toDateString(), {...acc, [t]: acc[t] || [0, 0, 0]}), obj);

        return Object.keys(temp)
        .sort((a, b) => new Date(a) - new Date(b))
        .reduce((acc, cur) => (acc[cur] = temp[cur], acc), {});
      }
      return f(this.statsData);
    },
  },
  mounted() {
    this.updateStatsData();
  }
}
</script>

<style lang="sass">
@import '../sass/components/_graph'
.stats
  .app-tips
    top: 60%
    left: 50%
    transform: translateX(-50%)
    z-index: 10
  display: grid
  height: 100vh
  width: 100vw
  grid-template-rows: 4fr 6fr
  grid-template-columns: 1fr
  grid-gap: 2rem
  align-content: center
  justify-content: center
.time-bar-wrapper
  height: 2rem
  width: 80vw
  align-self: start
  justify-self: center
  position: relative
  margin-top: 4rem
  &:after
    content: '60h'
    color: $blue
    font-weight: bold
    display: block
    position: absolute
    left: calc(100% + 1rem)
    bottom: 100%
    transform: translateY(50%)
  .result-label
    height: auto
    width: auto
    padding: 0.5rem 1rem
    display: grid
    grid-template-rows: 1fr
    grid-template-columns: 1fr
    align-content: center
    justify-content: center
    opacity: 1
    left: 0
    bottom: calc(100% + 1rem)
    transition: left 1s ease
    transform: translateX(-50%)
  .time-bar
    height: 0.5rem
    border-radius: 999px
    overflow: hidden
    .time-bar-inner
      transform: scaleX(0.5)
.result
  align-self: end
  justify-self: center
  display: grid
  grid-template-rows: 1fr 
  grid-template-columns: 1fr 1fr 1fr
  align-content: center
  justify-content: center
  align-items: center
  justify-content: center
  grid-gap: 2rem
  position: relative
  .value
    font-size: 3rem
    font-weight: bold
    .tooltip-text
      font-weight: normal
      width: 7.5rem
      padding: 0.5rem
.total-time  
  sup
    font-size: 1rem
</style>

