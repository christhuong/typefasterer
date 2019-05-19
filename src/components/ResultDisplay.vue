<template lang="pug">
#result-display.screen-children-size.result-display
  ResultConfetti(v-if="congrats")
  span.exit-icon( @click="setDisplayResult(false)" )
  .col-label.result-row
    .date-col Date
    .time-col Test time
    .speed-col Words/minute
    .error-col Error rate
  .results-wrapper
    .result-row(
      v-for="(el, i) in results" 
      :class="currentRowClass(i)" 
      :key="`${el}_${i}`"
      )
      .result-date {{date[i]}}
      .result-time.blue {{time[i]}}
      .result-speed.green-text {{speed[i]}}
      .result-error.red {{error[i]}}%
</template>
<script>
import ResultConfetti from './ResultConfetti.vue'
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  name: 'ResultDisplay',
  components: {
    ResultConfetti,
  },
  methods: {
    ...mapMutations({
      setDisplayResult: 'SET_DISPLAY_RESULT',
      notify: 'NOTIFY',
    }),
    ...mapActions({
      updateStatsData: 'updateStatsData',
    }),
    currentRowClass(i) {
      if (i !== 0) return;
      return {
        'current': true,
        'green-border': this.congrats,
        'red-border': !this.congrats,
      }
    },
  },
  computed: {
    ...mapState({
      statsResults: 'statsResults'
    }),
    results() {
      return this.statsResults.sort((b, a) => new Date(a[0]) - new Date(b[0]));
    },
    date() {
      return this.statsResults ? this.statsResults.map(el =>
        new Date(el[0]).toDateString().slice(4)) : []
    },
    time() {
      return this.statsResults ? this.statsResults.map(el => `${Math.round(el[1]/60*100)/100} ${el[1]/60 === 1 ? 'min' : 'mins'}`) : []
    },
    speed() {
      return this.statsResults ? this.statsResults.map(el => el[2]) : []
    },
    error() {
      return this.statsResults ? this.statsResults.map(el => Math.round(el[3])) : []
    },
    congrats() {
      return this.speed[0] >= this.speed[1] && this.error[0] <= this.error[1];
    },
    resultLength() {
      return this.results.length;
    }
  },
  watch: {
    resultLength() {
      if (this.congrats) {
        this.notify({type: 'success', message: 'Congrats! you made an improvement!'})
      } else {
        this.notify({type: 'error', message: 'You did type faster and made less error than this! Try harder!'})
      }
    }
  },
  created() {
    this.updateStatsData()
  }
}
</script>
<style lang="sass">
.result-display
  position: relative
  padding: 10px
  margin: auto
  border-radius: 0 0 5px 5px
  display: grid
  grid-template-columns: 1fr
  grid-template-rows: 2.5rem auto
  grid-row-gap: 0.5rem
  justify-content: center
  align-content: start
  justify-items: stretch
  .results-wrapper
    display: grid
    grid-template-columns: 1fr
    grid-auto-rows: 3rem
    justify-content: center
    align-content: start
    justify-items: stretch
    overflow-y: scroll
    position-relative
  .result-row
    display: grid
    grid-template-columns: repeat(4, 1fr)
    grid-template-rows: 1fr
    place-content: center
    place-items: center
  .col-label
    font-weight: bold
    border-bottom: none
  .current
    font-weight: bold
</style>
