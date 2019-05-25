<template lang="pug">
#app-control-buttons.app-control-buttons
  input#mobile-input(
    type="text"
    v-if="isMobile" 
    ref="input"
    autocapitalize="off" 
    autocomplete="off"
    spellcheck="false" 
    autocorrect="off"
    @input.prevent="handleInput"
    )
  button.pauseBtn(
    @click="pause()" 
    :disabled="app.paused || !app.running"
    )
    svg(
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 30 35"
      )
      path.btnIcon#pauseIcon(
        :class="{gray: app.paused || !app.running}" 
        d="M6,40H16V5H6ZM26,5V40H36V5Z" 
        transform="translate(-6 -5)"
        )
  button.startBtn(
    @click="app.paused ? resume() : start()" 
    :disabled="!app.paused && app.running"
    )
    svg(
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 27.5 35"
      )
      path.btnIcon#playIcon(
        :class="{gray: !app.paused && app.running}" 
        d="M8,5V40L35.5,22.5Z" 
        transform="translate(-8 -5)"
        )
  button.resetBtn(
    @click="reset()" 
    :disabled="!app.running || !app.paused"
    )
    svg(
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 28 35"
      )
      path.btnIcon#resetIcon(
        :class="{gray: !app.running || !app.paused}" 
        d="M18,8V1L9.25,9.75,18,18.5v-7A10.5,10.5,0,1,1,7.5,22H4A14,14,0,1,0,18,8Z" 
        transform="translate(-4 -1)"
        )
</template>

<script>
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
export default {
  name: 'AppControlButtons',
  data() {
    return {
      counting: false,
      countInterval: null,
      endSession: false,
      firstKeyPressed: false,
      mobileInputLength: 0
    }
  },
  methods: {
    start() {
      if (this.isMobile) this.$refs.input.focus();
      if (!this.isMobile) this.addKeyEventListeners();
      this.appReset();
      this.appStart();
      this.setActiveFinger(this.activefinger(this.text[this.index].toLowerCase()))
    },
    pause() {
      if (!this.isMobile) this.removeKeyEventListeners();
      this.appPause();
      this.pauseTimer();
      this.firstKeyPressed = false;
    },
    resume() {
      if (this.isMobile) this.$refs.input.focus();
      if (!this.isMobile) this.addKeyEventListeners();
      this.appResume();
    },
    end() {
      if (!this.isMobile) this.removeKeyEventListeners();
      if (this.isMobile) this.$refs.input.value = '';
      this.appEnd();
      this.pauseTimer();
      this.updateResults();
      this.setDisplayResult(true);
    },
    reset() {
      this.firstKeyPressed = false;
      this.pauseTimer();
      this.appReset();
      this.mobileInputLength = 0;
      this.shuffle();
    },
    startTimer() {
      this.timerCountsDown(true);
    },
    pauseTimer() {
      this.timerCountsDown(false);
    },
    timerCountsDown(count = true) {
      if (!count) {
        this.countInterval && clearInterval(this.countInterval);
        this.countInterval = null;
        this.calculate();
        return
      }
      if (this.countInterval) return;
      this.countInterval = setInterval(() => {
        if (this.endSession) return;
        if (this.time.left <= 0) {
          clearInterval(this.countInterval);
          this.countInterval = null;
          this.end();
          return;
        }
        this.calculate();
        this.setTimeLeft(this.time.left - 1);
      }, 1000);
    },
    addKeyEventListeners() {
      document.addEventListener('keydown',this.handleKeyDown);
      document.addEventListener('keyup', this.handleKeyUp);
    },
    removeKeyEventListeners() {
      document.removeEventListener('keydown', this.handleKeyDown);
      document.removeEventListener('keyup', this.handleKeyUp);
    },
    handleKeyDown(event) {
      if (!this.firstKeyPressed) this.startTimer();
      this.firstKeyPressed = true;
      event.preventDefault();
      this.capslockPressed(event.getModifierState('CapsLock'));
      this.shiftPressed(event.getModifierState('Shift'));
      let eventKey = String(event.key).toLowerCase();
      switch (eventKey) {
        case 'capslock': eventKey = 'caps'; break;
        case 'control': eventKey = 'ctrl'; break;
        case 'wakeup': eventKey = 'fn'; break;
        default: break;
      } 
      if (eventKey === 'backspace') {
        this.back();
        return;
      }
      if (!this.enAllKeys.includes(eventKey)) return;
      this.addPressedKeys(eventKey);
      this.next(event.key);
    },
    handleKeyUp(event) {
      event.preventDefault();
      this.capslockPressed(event.getModifierState('CapsLock'));
      this.shiftPressed(event.getModifierState('Shift'));
      let eventKey = String(event.key).toLowerCase();
      switch (eventKey) {
        case 'capslock': eventKey = 'caps'; break;
        case 'control': eventKey = 'ctrl'; break;
        case 'wakeup': eventKey = 'fn'; break;
        default: break;
      }
      if (this.enAllKeys.indexOf(eventKey) === -1) return;
      this.clearPressedKeys();
    },
    handleInput() {
      if (!this.firstKeyPressed) this.startTimer();
      this.firstKeyPressed = true;
      let mobileInput = this.$refs.input.value;
      // console.log(mobileInput.length)
      let eventKey = mobileInput[mobileInput.length - 1];
      if (this.mobileInputLength > mobileInput.length) {
        this.back();
        this.mobileInputLength = mobileInput.length;
      } else {
        this.checkCorrect(eventKey);
        this.mobileInputLength = mobileInput.length;
      }
    },
    next(key) {
      this.checkCorrect(key);
      if (this.isMobile) return;
      this.clearActiveKeys(this.activeKeys.includes('caps'));
      this.addActiveKeys(this.text[this.index].toLowerCase());
      this.setActiveFinger(this.activefinger(this.text[this.index].toLowerCase()))
    },
    back() {
      this.redoCheckCorrect();
      if (this.isMobile) return;
      this.clearActiveKeys(this.activeKeys.includes('caps'));
      this.addActiveKeys(this.text[this.index].toLowerCase());
      this.setActiveFinger(this.activefinger(this.text[this.index].toLowerCase()));
    },
    activefinger(keyName) {
      if ('`1~!qaz'.includes(keyName)) return 'left little';
      if ('2wsx@'.includes(keyName)) return 'left ring';
      if ('3#edc'.includes(keyName)) return 'left middle';
      if ('45$%rtfgvb'.includes(keyName)) return 'left index';
      if ('0-=)_+p[]\\{}|;\':"/?'.includes(keyName)) return 'right little';
      if ('9ol.(>'.includes(keyName)) return 'right ring';
      if ('8*ik,<'.includes(keyName)) return 'right middle';
      if ('67yuhjnm^&'.includes(keyName)) return 'right index';
      if (keyName === ' ') return 'thumb';
    },
    ...mapMutations({
      addPressedKeys: 'ADD_PRESSED_KEYS',
      addActiveKeys: 'ADD_ACTIVE_KEYS',
      clearPressedKeys: 'CLEAR_PRESSED_KEYS',
      clearActiveKeys: 'CLEAR_ACTIVE_KEYS',
      shiftPressed: 'SHIFT_PRESSED',
      capslockPressed: 'CAPSLOCK_PRESSED',
      checkCorrect: 'CHECK_CORRECT',
      redoCheckCorrect: 'REDO_CHECK_CORRECT',
      appStart: 'APP_START',
      appPause: 'APP_PAUSE',
      appResume: 'APP_RESUME',
      appEnd: 'APP_END',
      appReset: 'APP_RESET',
      shuffle: 'SHUFFLE_TEXT',
      calculate: 'CALCULATE',
      setTimeLeft: 'SET_TIME_LEFT',
      setDisplayResult: 'SET_DISPLAY_RESULT',
      setActiveFinger: 'SET_ACTIVE_FINGER',
    }),
    ...mapActions({
      updateResults: 'updateResults',
    })
  },
  computed: {
    ...mapState({
      index: 'currentChar',
      text: 'textToType',
      activeKeys: 'activeKeys',
      enAllKeys: 'enAllKeys',
      app: 'app',
      time: 'time',
    }),
    ...mapGetters({
      isMobile: 'isMobile',
    })
  },
  mounted() {
    this.endSession = false;
    this.reset();
  },
  beforeDestroy() {
    this.removeKeyEventListeners();
    this.endSession = true;
  }
}
</script>

<style lang="sass">
#app-control-buttons
  white-space: nowrap
  position: relative
  #mobile-input
    position: fixed
    height: 0
    width: 0
    opacity: 0
    top: 20vh
    left: 50%
    transform: translate(-50%, 0)
    user-select: none
    pointer-events: none
  button
    height: 3.5rem
    width: 3.5rem
    border: none
    border-radius: 50%
    position: relative
    margin: 0.5rem
    cursor: pointer
    transition: background-color 200ms ease
    &.pauseBtn, &.resetBtn
      transform: scale(0.8)
    svg
      position: absolute
      top: 50%
      left: 50%
      height: 55%
      width: 55%
      transform: translate(-50%, -50%)
  button.startBtn svg
    left: 55%
#pauseIcon, #playIcon, #resetIcon 
  transition: fill 200ms ease
</style>
