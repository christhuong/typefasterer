<template lang="pug">
.app-user-form
  .app-user-inputs
    span.exit-icon(@click="goback()")
    .title.green.bold {{resettingPassword ? 'Reset your password' : (mode === 'login' ? 'Log in your account' : 'Create an account')}}
    //Email and password inputs
    .user-email.user-input
      label(for="email") email #[span(class='red') *] 
      input#email.gray-border.solid-border(
        type="email" 
        v-model="email" 
        @keyup="validateEmail()"
        placeholder="your.email@address.com"
        :class="[validatedEmail ? 'green-border' : (email !== '' && 'red-border')]"
        required
        )
    .user-password.user-input(v-if="!resettingPassword")
      label(for="password") password #[span(class='red') *] 
      input#password.gray-border.solid-border(
        type="password" 
        v-model="password" 
        @keyup="validatePassword()"
        placeholder="at least 6 characters, digits, or symbols"
        :class="[validatedPassword ? 'green-border' : (password !== '' && 'red-border')]"
        required
        )

    //Additional information
    template(v-if="mode === 'login' && !resettingPassword")
      .more-info
        p Not have an account yet? 
          span.blue.bold(@click="$router.push('/signup')") #[u Sign up]
        p Forget your password? 
          span.blue.bold(@click="resettingPassword = true") #[u Recover password]
    p.more-info(v-if="mode === 'signup' && !resettingPassword") Already have an account? 
      span.blue.bold(@click="$router.push('/login')") #[u Log in]
    p.more-info(v-if="resettingPassword") {{recoverMessage}}

    //Sign up or Log in button
    button.green-border.green.solid-border(@click.once="handleClick" type="submit" :disabled="disabled") {{ resettingPassword ? 'Sent recover email' : (mode === 'signup' ? 'Sign up' : 'Log in')}}
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import { mapMutations, mapState, mapActions } from 'vuex';
export default {
  name: 'AppUserForm',
  props: {
    mode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      email: '',
      password: '',
      emailPattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      validatedEmail: false,
      validatedPassword: false,
      resettingPassword: false,
      recoverEmailSent: false,
      disabled: false,
    }
  },
  methods: {
    ...mapMutations({
      notify: 'NOTIFY',
      setDisplayLoading: 'SET_DISPLAY_LOADING',
      setDisplayTips: 'SET_DISPLAY_TIPS',
    }),
    ...mapActions({
      createUserAccount: 'createUserAccount'
    }),
    goback() {
      this.$router.push('/')
    },
    recoverPassword() {
      if (!this.validatedEmail) return;
      this.setDisplayLoading(true);
      this.disabled = true;
      firebase.auth()
      .sendPasswordResetEmail(this.email)
      .then(() => {
        this.recoverEmailSent = true;
        this.setDisplayLoading(false)
        this.notify({type: 'success', message: 'Successfully sent a recovery email to you'})
      }).catch((error) => {
        this.setDisplayLoading(false);
        this.disabled = false;
        this.notify({type: 'error', message: error.message})
      });
    },
    validateEmail(force = true) {
      if (!force) {
        this.validatedEmail = false;
        return
      }
      let validated = this.email !== '' && this.emailPattern.test(String(this.email).toLowerCase());
      this.validatedEmail = validated;
    },
    validatePassword(force = true) {
      if (!force) {
        this.validatedPassword = false;
        return
      }
      let validated = this.password !== '' && this.password.length >= 6;
      this.validatedPassword = validated;
    },
    handleClick() {
      if (this.resettingPassword) {
        this.recoverPassword();
        return
      }
      if (this.mode === 'login') this.loginUser();
      if (this.mode === 'signup') this.signupUser();
      return
    },
    signupUser() {
      if (!this.validatedEmail || !this.validatedPassword) {
        let type = 'error';
        let message = '';
        if (this.email === '') {
          message = 'Please fill in your email to sign up'
        } else if (this.password === '') {
          message = 'Please enter your password to sign up'
        } else {
          message = 'Please enter valid email and password'
        }
        this.notify({type, message})
        return;
      }
      this.setDisplayLoading(true)
      firebase.auth()
      .createUserWithEmailAndPassword(this.email, this.password)
      .then(
        () => {
          this.createUserAccount(firebase.auth().currentUser.uid)
          this.setDisplayLoading(false)
          this.notify({type: 'success', message: 'Sign up successfully! Enjoy our app!'})
        }
      )
      .catch((error) => {
        this.validateEmail(false);
        this.validatePassword(false);
        this.setDisplayLoading(false);
        this.notify({type: 'error', message: error.message});
      });
    },
    loginUser() {
      if (!this.validatedEmail || !this.validatedPassword) {
        let type = 'error';
        let message = '';
        if (this.email === '') {
          message = 'Please fill in your email to log in'
        } else if (this.password === '') {
          message = 'Please enter your password to log in'
        } else {
          message = 'Please enter your correct email and password'
        }
        this.notify({type, message})
        return;
      }
      this.setDisplayLoading(true)
      firebase.auth()
      .signInWithEmailAndPassword(this.email, this.password)
      .then(
        user => {
          this.setDisplayLoading(false)
          this.notify({type: 'success', message: 'Log in successfully! Enjoy our app!'})
        }
      )
      .catch((error) => {
        this.validateEmail(false);
        this.validatePassword(false);
        this.setDisplayLoading(false);
        this.notify({
          type: 'error', 
          message: 'Sign in fails. Please check your email and password again'
          });
      });
    }
  },
  computed: {
    ...mapState({
      userLogIn: 'userLogIn'
    }),
    recoverMessage() {
      if (this.resettingPassword && this.recoverEmailSent) {
        return `We have sent you a password recovery email. \n
        Please check your inbox to change your password`
      }
      if (this.resettingPassword && !this.recoverEmailSent) {
        return `Enter your email then we will sent you an email to change your password`
      }
    }
  },
  mounted() {
    this.setDisplayTips(false)
  }
}
</script>

<style lang="sass" scoped>
.app-user-form
  position: fixed
  height: 100vh
  width: 100vw
  top: 0
  left: 0
  .app-user-inputs
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    width: 28rem
    height: auto
    display: grid
    align-content: center
    justify-content: center
    align-items: center
    justify-items: center
    padding: 2rem 1rem
    grid-gap: 1rem
    grid-template-columns: 1fr
    grid-template-rows: 1fr 2fr 2fr 1fr 1fr
    border-radius: 10px
    .more-info
      width: 20rem
      text-align: left
      font-size: 0.75rem
      span
        cursor: pointer
    .title
      width: 20rem
      font-size: 1.5rem
      text-align: left
    .user-input
      text-align: left
      label
        padding: 0
        text-transform: uppercase
        font-size: 0.75rem
      input
        background: transparent
    button
      width: auto
      height: 2.5rem
      padding: 0 1rem
      border-radius: 5px
      border-width: 1px
      margin: auto
      display: block
      background: none
      font-size: 1rem
      cursor: pointer
#email, #password
  display: block
  background: none
  border-radius: 5px
  height: 2.5rem
  padding: 0 1rem
  width: 20rem
  border-width: 1px
  margin-top: 0.5rem
</style>
