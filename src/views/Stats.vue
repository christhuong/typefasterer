<template lang="pug">
#stats.stats
  .switch
    button(
      @click="showMobile = !showMobile"
      :class="{'green green-border solid-border': showMobile}"
      ) Mobile
    button(
      @click="showMobile = !showMobile"
      :class="{'green green-border solid-border': !showMobile}"
      ) Computer
  .result
    .total-time.blue
      .value.tooltip {{`0${Math.floor(totalTime/60/60)}`.slice(-2)}}#[sup h]{{`0${Math.round((totalTime/60)%60)}`.slice(-2)}}#[sup m]
        .tooltip-text Your total<br>practice time
      .label total practice <br>time
    .average-speed.green-text
      .value.tooltip
        .tooltip-text The higher the better
        animated-number(:value="averageSpeed")
      .label words per <br>minute
    .average-error.red
      .value.tooltip
        .tooltip-text Good if lower than 5%
        animated-number(:value="averageError" :unit="'%'")
      .label average <br>error rate

  .graph#graph(v-if="showMobile")
    .result-cells-container
      .result-lines
        div(:style="lineClass(0)" :data-content="`${Math.round(averageTime/60)}'`")
        div(:style="lineClass(1)" :data-content="`${Math.round(averageSpeed)}`")
        div(:style="lineClass(2)" :data-content="`${Math.round(averageError)}%`")
      .result-cell(v-for="(arr, name, index) in refinedStatsData")
        .result-label
          div {{Math.round(arr[0]/60)}}m
          div {{arr[1].toFixed(1)}}
          div {{arr[2].toFixed(1)}}%
        .date-row {{name.split(" ")[2]}}
          sup {{name.split(' ')[1]}}
        .result-col.time-col(:style="styleClass(0, arr)")
        .result-col.speed-col(:style="styleClass(1, arr)")
        .result-col.error-col(:style="styleClass(2, arr)")
  .graph#graph(v-else)
    .result-cells-container
      .result-lines
        div(:style="lineClass(0)" :data-content="`${Math.round(averageTime/60)}'`")
        div(:style="lineClass(1)" :data-content="`${Math.round(averageSpeed)}`")
        div(:style="lineClass(2)" :data-content="`${Math.round(averageError)}%`")
      .result-cell(v-for="(arr, name, index) in refinedStatsData")
        .result-label
          div {{Math.round(arr[0]/60)}}m
          div {{arr[1].toFixed(1)}}
          div {{arr[2].toFixed(1)}}%
        .date-row {{name.split(" ")[2]}}
          sup {{name.split(' ')[1]}}
        .result-col.time-col(:style="styleClass(0, arr)")
        .result-col.speed-col(:style="styleClass(1, arr)")
        .result-col.error-col(:style="styleClass(2, arr)")
</template>

<script>
import AnimatedNumber from "../components/AnimatedNumber.vue";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "stats",
  components: {
    AnimatedNumber
  },
  data() {
    return {
      showMobile: false
    };
  },
  methods: {
    ...mapActions({
      updateStatsData: "updateStatsData"
    }),
    ...mapMutations({
      notify: "NOTIFY"
    }),
    styleClass(name, arr) {
      let data =
        name === 0 ? this.maxTime : name === 1 ? this.maxSpeed : this.maxError;
      return {
        transform: `scaleY(${
          arr.length > 0 && data > 0 ? arr[name] / data : 0
        })`
      };
    },
    lineClass(name) {
      let aver =
        name === 0
          ? this.averageTime
          : name === 1
          ? this.averageSpeed
          : this.averageError;
      let max =
        name === 0 ? this.maxTime : name === 1 ? this.maxSpeed : this.maxError;
      return {
        bottom: `${(aver / max) * 100}%`
      };
    }
  },
  computed: {
    ...mapState({
      statsResults: "statsResults",
      statsData: "statsData",
      statsResultsMobile: "statsResultsMobile",
      statsDataMobile: "statsDataMobile"
    }),
    ...mapGetters({
      isMobile: "isMobile"
    }),
    totalTime() {
      let data = this.showMobile ? this.statsDataMobile : this.statsData;
      return Object.values(data).length > 0
        ? [...Object.values(data)]
            .map(el => el[0])
            .reduce((acc, cur) => acc + cur, 0)
        : 0;
    },
    averageTime() {
      let data = this.showMobile ? this.statsDataMobile : this.statsData;
      let len = Object.keys(data).length;
      return len > 0 ? this.totalTime / len : 0;
    },
    averageSpeed() {
      let data = this.showMobile ? this.statsResultsMobile : this.statsResults;
      let speed =
        data.length > 0
          ? data.map(el => parseInt(el[2])).reduce((acc, cur) => acc + cur, 0) /
            data.length
          : 0;
      return Math.round(speed * 100) / 100;
    },
    averageError() {
      let data = this.showMobile ? this.statsResultsMobile : this.statsResults;
      let error =
        data.length > 0
          ? data.map(el => parseInt(el[3])).reduce((acc, cur) => acc + cur, 0) /
            data.length
          : 0;
      return Math.round(error * 100) / 100;
    },
    maxTime() {
      let data = this.showMobile ? this.statsDataMobile : this.statsData;
      return Object.values(data).length > 0
        ? Math.max(...[...Object.values(data)].map(el => el[0]))
        : 0;
    },
    maxSpeed() {
      let data = this.showMobile ? this.statsResultsMobile : this.statsResults;
      let speed =
        data.length > 0 ? Math.max(...data.map(el => parseInt(el[2]))) : 0;
      return speed;
    },
    maxError() {
      let data = this.showMobile ? this.statsResultsMobile : this.statsResults;
      let error =
        data.length > 0 ? Math.max(...data.map(el => parseInt(el[3]))) : 0;
      return error;
    },
    refinedStatsData() {
      let data = this.showMobile ? this.statsDataMobile : this.statsData;
      const f = obj => {
        const k = 86400000;
        let t;
        let temp = Object.keys(obj)
          .map(el => new Date(el).getTime())
          .sort((a, b) => b - a)
          .reduce(
            (acc, cur, i, self) =>
              i
                ? acc.concat(
                    [
                      ...Array(
                        Math.ceil(Math.abs(cur - self[i - 1])) / k
                      ).keys()
                    ].map(el => cur + (el + 1) * k)
                  )
                : [cur],
            []
          )
          .reduce(
            (acc, cur) => (
              (t = new Date(cur).toDateString()),
              { ...acc, [t]: acc[t] || [0, 0, 0] }
            ),
            obj
          );
        return Object.keys(temp)
          .sort((a, b) => new Date(a) - new Date(b))
          .reduce((acc, cur) => ((acc[cur] = temp[cur]), acc), {});
      };
      return f(data);
    }
  },
  mounted() {
    this.updateStatsData();
  }
};
</script>

<style lang="sass">
@import '../sass/components/_graph'
.stats
  display: grid
  height: 100vh
  width: 100vw
  grid-template-rows: 3fr 3fr 6fr
  grid-template-columns: 1fr
  grid-gap: 2rem
  align-content: center
  justify-content: center
  .switch
    align-self: end
    button
      border-width: 1px
      margin: 0 0.5rem
      &.green
        color: $green-text
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
    user-select: none
    font-size: 3rem
    font-weight: bold
    .tooltip-text
      font-weight: normal
      width: 7.5rem
      padding: 0.5rem
  .label
    user-select: none
    transform-origin: left center
    text-align: left
    transform: translate(50%, -1rem) rotate(90deg)
.total-time
  sup
    font-size: 1rem
</style>
