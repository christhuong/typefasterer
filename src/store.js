import Vue from 'vue'
import Vuex from 'vuex'
import db from './components/firebaseInit'
import { auth } from 'firebase/app'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //TEXT RELATED
    currentChar: 0, //current index of the text being typed
    activeFinger: '',
    defaultText: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.Et harum quidem rerum facilis est et expedita distinctio.Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
    chosenText: [],
    typingMode: 'keyboard', //typing mode for practice
    textToType: "", //the text that will be rendered to the display
    enAllKeys: "`1234567890-=~!@#$%^&*()_+backtabqwertyuiop[]\\{}|asdfghjkl;':\"enterzxcvbnm,./<>?fnctrlaltspace ", //all the keys on the english keyboard

    time: {
      allotted: 60,
      left: 0
    },

    errorIndices: [], //the array of all typing errors
    correctCharCount: 0, //indicates the number of correct typed keys
    wrongCharCount: 0, //indicates the number of correct typed keys
    speed: 0, //typing speed
    error: 0, //typing error rate

    //KEYBOARD STATES
    pressedKeys: [], //all pressed keys
    activeKeys: [], //all active keys
    grayScale: true, //if the keyboard is gray
    shiftKeyActive: false, //if the shift key is pressed
    uppercaseOn: false, //
    displaySymbols: false,

    displayResult: false, //display result panel or not
    displayBurger: false,
    displayOptions: false, //display the typing mode panel
    displayLoading: false,

    byWord: false, //type by word or by letters


    //FROM FIREBASE
    typingText: {
      words: {
        nouns: [],
        verbs: [],
        adjectives: [],
        adverbs: [],
        words: [],
      },
      sentences: {
        news: [],
        'dummy text': [],
      }
    },

    //APP STATES
    app: {
      mode: 'practice',
      running: false,
      paused: false,
      beforeRestart: false,
      theme: 'dark',
    },

    notification: {
      display: false,
      message: '',
      type: '',
    },

    //USER STATES
    userLogIn: false,
    currentUser: {},
    currentUserResults: [],

    //LOCAL STORAGE
    anonymousUserResults: [], //typing results saved in localstorage

    //STATS
    statsResults: [],
    statsData: {},
  },
  mutations: {
    // ADD
    ADD_ERROR(state, pos) {
      if (!state.errorIndices.join().includes(String(pos))) state.errorIndices.push(pos);
    },
    ADD_PRESSED_KEYS(state, key) {
      state.pressedKeys.push(key);
    },
    ADD_ACTIVE_KEYS(state, key = state.textToType[state.currentChar]) {
      state.activeKeys.push(key);
      state.shiftKeyActive = `AQWERTYUIOPASDFGHJKLZXCVBNM~!@#$%^&*()_+{}|:"<>?`.includes(state.textToType[state.currentChar]);
      if (state.shiftKeyActive && state.activeKeys.includes('shift')) state.activeKeys.push('shift');
    },

    //CLEAR
    CLEAR_ACTIVE_KEYS(state, payload) {
      state.activeKeys = payload ? ['caps'] : [];
    },
    CLEAR_PRESSED_KEYS(state) {
      state.pressedKeys = [];
    },
    CLEAR_NOTIFICATION(state) {
      state.notification.display = false;
    },
    CLEAR_CURRENT_USER_RESULTS(state) {
      state.currentUserResults = {};
    },
    CLEAR_CURRENT_USER(state) {
      state.currentUser = {};
    },

    //SET
    SET_TIME_ALLOTTED(state, time = 60) {
      state.time.allotted = time;
      state.time.left = time;
    },
    SET_TIME_LEFT(state, time) {
      state.time.left = time;
    },
    SET_TYPING_MODE(state, mode = 'keyboard') {
      state.typingMode = mode;
    },
    SET_DISPLAY_BURGER(state, displaying = false) {
      state.displayBurger = displaying;
    },
    SET_ACTIVE_FINGER(state, finger = '') {
      state.activeFinger = finger
    },
    SET_CURRENT_USER(state, user = {}) {
      state.currentUser = user;
    },
    SET_CURRENT_USER_RESULTS(state, userData = {}) {
      state.currentUserResults = userData;
    },
    SET_DISPLAY_LOADING(state, loading = true) {
      state.displayLoading = loading
    },
    SET_DISPLAY_OPTIONS(state, payload = false) {
      state.displayOptions = payload;
    },
    SET_DISPLAY_RESULT(state, displaying = false) {
      state.displayResult = displaying;
    },
    SET_APP_THEME(state, theme = 'dark') {
      localStorage.setItem('typingAppTheme', theme);
      state.app.theme = theme;
      document.getElementById('theme-color').setAttribute('content', theme === 'light' ? '#eaeaea' : '#000000')
    },
    SET_TEXT(state, textarr) {
      state.textToType = textarr;
      state.time.left = state.time.allotted;
      state.correctCharCount = 0;
      state.currentChar = 0;
      state.errorIndices = [];
      state.wrongCharCount = 0;
      state.speed = 0;
      state.error = 0;
    },

    //KEYBOARD
    SHIFT_PRESSED(state, payload) {
      state.shiftKeyActive = payload;
      state.uppercaseOn = (payload && state.uppercaseOn || !payload && !state.uppercaseOn) ? false : true;
      state.displaySymbols = payload;
      state.shiftKeyActive = `AQWERTYUIOPASDFGHJKLZXCVBNM~!@#$%^&*()_+{}|:"<>?`.includes(state.textToType[state.currentChar]);
      if (state.shiftKeyActive && state.activeKeys.includes('shift')) state.activeKeys.push('shift');
    },
    CAPSLOCK_PRESSED(state, payload) {
      state.uppercaseOn = payload;
      let i = state.activeKeys.indexOf('caps');
      if (payload && i === -1) {
        state.activeKeys.push('caps')
      } else if (!payload && i !== -1) {
        state.activeKeys.splice(i, 1);
      }
    },

    //APP STATES
    APP_START(state) {
      state.app.running = true;
      state.app.beforeRestart = false;
      if (state.time.left <= 0) state.time.left = state.time.allotted;
      if (state.textToType === "") state.textToType = state.defaultText;
      state.activeKeys.includes(state.textToType[state.currentChar].toLowerCase()) || state.activeKeys.push(state.textToType[state.currentChar].toLowerCase());
      state.shiftKeyActive = `AQWERTYUIOPASDFGHJKLZXCVBNM~!@#$%^&*()_+{}|:'<>?`.includes(state.textToType[state.currentChar]);
      if (state.shiftKeyActive && state.activeKeys.includes('shift')) state.activeKeys.push('shift');
    },
    APP_PAUSE(state) {
      state.app.paused = true;
    },
    APP_RESUME(state) {
      state.app.paused = false;
    },
    APP_RESET(state) {
      state.app.running = false;
      state.app.paused = false;
      state.app.beforeRestart = false;
      state.shiftKeyActive = false;
      state.time.left = 0;
      state.correctCharCount = 0;
      state.currentChar = 0;
      state.errorIndices = [];
      state.wrongCharCount = 0;
      state.speed = 0;
      state.error = 0;
      state.pressedKeys = [];
      state.activeKeys = [];
      state.displayResult = false;
      state.displayOptions = false;
      state.activeFinger = '';
    },
    APP_END(state) {
      state.app.running = false;
      state.app.beforeRestart = true;
      state.activeKeys = [];
    },

    CHECK_CORRECT(state, key) {
      if (key === state.textToType[state.currentChar]) {
        state.correctCharCount++;
        state.currentChar += 1;
        if (state.currentChar >= state.textToType.length) {
          state.textToType = state.textToType + ' ' + state.textToType;
        }
      } else {
        state.wrongCharCount++;
        state.errorIndices.includes(state.currentChar) || state.errorIndices.push(state.currentChar);
      }
    },
    CHANGE_APP_MODE(state, mode = 'practice') {
      state.app.mode = mode;
    },
    CALCULATE(state) {
      state.speed = (state.time.allotted - state.time.left) === 0 ? 0 : Math.round(((100 * state.correctCharCount / 5) / ((state.time.allotted - state.time.left) / 60))) / 100;
      state.error = state.correctCharCount + state.wrongCharCount === 0 ? 0 : Math.round(100 * 100 * state.wrongCharCount / (state.wrongCharCount + state.correctCharCount)) / 100;
    },
    SHUFFLE_TEXT(state) {
      const shuff = arr => arr.reduce((_, cur, index, self) => {
        const i = self.length - index - 1;
        const j = Math.floor(Math.random() * i);
        cur = self[i];
        self[i] = self[j];
        self[j] = cur;
        return self;
      }, []);
      if (state.typingMode === 'sentences' || state.typingMode === 'custom') {
        return
      } else {
        state.textToType = shuff(state.textToType.split(' ')).join(' ');
      }
    },
    //TOGGLE
    TOGGLE_KB_COLOR(state) {
      state.grayScale = !state.grayScale;
    },
    TOGGLE_TYPING_MODE(state) {
      state.byWord = !state.byWord;
    },

    //UPDATE
    UPDATE_APP_THEME(state) {
      state.app.theme = localStorage.getItem('typingAppTheme');
    },
    UPDATE_STATS_DATA(state, resultArr) {
      if (resultArr.length <= 0) return
      state.statsResults = resultArr;
      const func = inputArr => {
        if (inputArr.length <= 0 || !inputArr) return
        let count = inputArr.map(el => new Date(el[0]).toDateString()).reduce((acc, cur) => acc[cur] ? (acc[cur]++ , acc) : (acc[cur] = 1, acc), {});

        let obj = inputArr.reduce((acc, [a, ...b]) => acc[new Date(a).toDateString()] ? (acc[new Date(a).toDateString()] = acc[new Date(a).toDateString()].map((_, i, d) => (b[i] + d[i])), acc) : (acc[new Date(a).toDateString()] = b, acc), {});

        for (let o in obj) {
          obj[o] = obj[o].map((el, i) => i === 0 ? el : Math.round(100 * el / count[o]) / 100);
        }

        let keys = Object.keys(obj).sort((a, b) => new Date(a) - new Date(b));

        return keys.reduce((acc, cur) => (acc[cur] = obj[cur], acc), {});
      };
      state.statsData = func(resultArr);
    },
    GET_ANONYMOUS_USER_RESULTS(state) {
      state.anonymousUserResults = localStorage.getItem('typingData') ? JSON.parse(localStorage.getItem('typingData')) : {};
    },
    UPDATE_ANONYMOUS_USER_RESULTS(state) {
      let typingData = localStorage.getItem('typingData') ? JSON.parse(localStorage.getItem('typingData')) : {};
      /* 
      typingDate = [
        [date, time, speed, error],
        [date, time,speed, error]
      ]
      */
      typingData.push([new Date(), state.time.allotted, state.speed, state.error]);
      state.anonymousUserResults = typingData;
      localStorage.setItem('typingData', JSON.stringify(typingData));
    },
    NOTIFY(state, notification = { message: '', type: '' }) {
      state.notification.display = true;
      state.notification.message = notification.message;
      state.notification.type = notification.type;
    },
    SET_USER_LOG_IN(state, logIn = true) {
      state.userLogIn = logIn;
    },
    SET_TYPINGTEXT_FROM_FIRESTORE(state, dataObj) {
      if (Object.keys(dataObj.data).length <= 0) return;
      Object.keys(dataObj.data).map(el => {
        switch (dataObj.key) {
          case 'words':
            state.typingText.words[el] = dataObj.data[el].join('').split(','); break;
          case 'sentences':
            state.typingText.sentences[el] = dataObj.data[el];
            break;
          default:
            state.typingText[dataObj.key][el] = dataObj.data[el];
            break;
        }
      });
    },
  },
  actions: {
    createUserAccount(_, id) {
      db.collection("users").doc(id).set({
        typingData: ''
      });
    },
    getTextFromFirestore({ commit }) {
      db.doc('typingText/words').get().then(doc => {
        commit('SET_TYPINGTEXT_FROM_FIRESTORE', { data: doc.data(), key: 'words' })
      });
      db.doc('typingText/sentences').get().then(doc => {
        commit('SET_TYPINGTEXT_FROM_FIRESTORE', { data: doc.data(), key: 'sentences' })
      })
    },
    updateCurrentUserResults({ state }) {
      let typingDataString = state.currentUserResults.length > 0 ? state.currentUserResults : [];
      typingDataString.push([new Date(), state.time.allotted, state.speed, state.error]);
      state.currentUserResults = typingDataString;
      db.collection('users').doc(state.currentUser.id).set({
        typingData: JSON.stringify(typingDataString)
      });
    },
    getCurrentUserResults({ commit, state }) {
      db.collection('users').doc(state.currentUser.id).get().then(doc => {
        let typingData = doc.data().typingData !== '' ? JSON.parse(doc.data().typingData) : [];
        commit('SET_CURRENT_USER_RESULTS', typingData);
      });
    },
    updateResults({ commit, dispatch, state }) {
      if (state.userLogIn) {
        dispatch('updateCurrentUserResults')
      } else {
        commit('UPDATE_ANONYMOUS_USER_RESULTS')
      }
    },
    updateStatsData({ state, commit, dispatch }) {
      if (state.userLogIn) {
        dispatch('getCurrentUserResults');
        commit('UPDATE_STATS_DATA', state.currentUserResults)
      } else {
        commit('GET_ANONYMOUS_USER_RESULTS');
        commit('UPDATE_STATS_DATA', state.anonymousUserResults)
      }
    },
    userObserver({ commit, dispatch }) {
      dispatch('getTextFromFirestore');
      auth().onAuthStateChanged(user => {
        if (user) {
          let userData = {
            id: user.uid,
            name: user.displayName,
            email: user.email,
          }
          commit('SET_USER_LOG_IN', true);
          commit('SET_CURRENT_USER', userData);
          dispatch('updateStatsData');
        } else {
          commit('SET_USER_LOG_IN', false);
          commit('CLEAR_CURRENT_USER');
          dispatch('updateStatsData');
        }
      });
    }
  }
})