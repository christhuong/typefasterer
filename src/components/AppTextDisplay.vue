<template lang='pug'>
#app-text-display.app-text-display(:class="{'test-mode': app.mode === 'test'}" )
  .time-progress-bar(v-if="app.mode !=='practice'")
    .time-bar-inner(:style='{transform: `scaleX(${app.running ? 1 - time.left/time.allotted : 0})`}')
  h1(v-html="app.running ? modifiedText : app.mode === 'practice' ? defaultText : modifiedText")
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: "AppTextDisplay",
  data() {
    return {
      defaultText: `<span class='thin'>Welcome to</span> <span class="bold blue">type fasterer</span> <span class="guide blinking">&nbsp&nbsp</span>`,
      defaultTestText: ["time","year","people","way","day","man","thing","woman","life","child","world","school","state","family","student","group","country","problem","hand","part","place","case","week","company","system","program","question","work","government","number","night","point","home","water","room","mother","area","money","story","fact","month","lot","right","study","book","eye","job","word","business","issue","side","kind","head","house","service","friend","father","power","hour","game","line","end","member","law","car","city","community","name","president","team","minute","idea","kid","body","information","back","parent","face","others","level","office","door","health","person","art","war","history","party","result","change","morning","reason","research","girl","guy","moment","air","teacher","force","education", "other","new","good","high","old","great","big","American","small","large","national","young","different","black","long","little","important","political","bad","white","real","best","right","social","only","public","sure","low","early","able","human","local","late","hard","major","better","economic","strong","possible","whole","free","military","true","federal","international","full","special","easy","clear","recent","certain","personal","open","red","difficult","available","likely","short","single","medical","current","wrong","private","past","foreign","fine","common","poor","natural","significant","similar","hot","dead","central","happy","serious","ready","simple","left","physical","general","environmental","financial","blue","democratic","dark","various","entire","close","legal","religious","cold","final","main","green","nice","huge","popular","traditional","cultural", "be","have","do","say","go","can","get","would","make","know","will","think","take","see","come","could","want","look","use","find","give","tell","work","may","should","call","try","ask","need","feel","become","leave","put","mean","keep","let","begin","seem","help","talk","turn","start","might","show","hear","play","run","move","like","live","believe","hold","bring","happen","must","write","provide","sit","stand","lose","pay","meet","include","continue","set","learn","change","lead","understand","watch","follow","stop","create","speak","read","allow","add","spend","grow","open","walk","win","offer","remember","love","consider","appear","buy","wait","serve","die","send","expect","build","stay","fall","cut","reach","kill","remain", "up","so","out","just","now","how","then","more","also","here","well","only","very","even","back","there","down","still","in","as","to","when","never","really","most","on","why","about","over","again","where","right","off","always","today","all","far","long","away","yet","often","ever","however","almost","later","much","once","least","ago","together","around","already","enough","both","maybe","actually","probably","home","ofcourse","perhaps","little","else","sometimes","finally","less","better","early","especially","either","quite","simply","nearly","soon","certainly","quickly","no","recently","before","usually","thus","exactly","hard","particularly","pretty","forward","ok","clearly","indeed","rather","that","tonight","close","suddenly","best","instead","ahead","fast","alone","eventually","directly"],
      scrolltop: 0,
      guideParent: ''
    }
  },
  methods: {
    setChosenText() {
      this.setText(this.defaultTestText.join(' '));
    },
    ...mapMutations({
      setText: 'SET_TEXT',
    }),
    adjustScroll() {
      if (this.guideParent === '') return false;
      if (this.guideRect().bottom >= this.parentRect().bottom) {
        this.guideParent.scrollTop += this.guideRect().height;
      }
    },
    guideRect() {
      return document.querySelector('.guide') ? document.querySelector('.guide').getBoundingClientRect() : {};
    },
    parentRect() {
      if (!document.querySelector('#app-text-display h1')) return {}
      this.guideParent = document.querySelector('#app-text-display h1');
      return this.guideParent.getBoundingClientRect();
    }
  },
  computed: {
    ...mapState({
      index: 'currentChar',
      text: 'textToType',
      errorArr: 'errorIndices',
      app: 'app',
      time: 'time',
    }),
    modifiedText() {
      if (!this.guideRect().bottom && this.guideParent !== '') this.guideParent.scrollTop = 0;
      let tempText = this.text.split('').map((el, i) => {
        let guide = i === this.index ? 'guide' : '';
        let mistake = this.errorArr.includes(i) ? 'wrong-char' : '';
        let space = el === " " && (!!guide || !!mistake) ? 'space' : '';
        return (!!guide || !!mistake) ? `<span class="${space} ${mistake} ${guide}" >${el}</span>` : el;
      });
      if (this.index > 0) {
        tempText[0] = `<span class='gray'>${tempText[0]}`;
        tempText[this.index] = `</span>${tempText[this.index]}`;
      }
      return tempText.join('');
    },
  },
  watch: {
    text() {
      if (this.guideParent) this.guideParent.scrollTop = 0;
    }
  },
  mounted() {
    if (this.app.mode === 'test' && this.text === '') this.setChosenText(this.defaultTestText);
    this.guideParent = document.querySelector('#app-text-display h1');
    this.guideParent.scrollTop = 0;
  },
  updated() {
    this.adjustScroll();
  },
  beforeDestroy() {
    this.guideParent = null;
  }
}
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
