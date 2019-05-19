<template lang="pug">
.wrap
  AppUserForm(mode="signup")
</template>

<script>
import AppUserForm from '../components/AppUserForm.vue'
export default {
  name: 'UserSignupForm',
  components: {
    AppUserForm,
  }
}
</script>

