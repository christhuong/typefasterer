import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Test from "./views/Test.vue";
import Stats from "./views/Stats.vue";
import About from "./views/About.vue";
import UserSignupForm from "./views/UserSignupForm.vue";
import UserLoginForm from "./views/UserLoginForm.vue";
import firebase from "firebase/app";
import "firebase/auth";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      component: About
    },
    {
      path: "/test",
      name: "test",
      component: Test
    },
    {
      path: "/stats",
      name: "stats",
      component: Stats
    },
    {
      path: "/signup",
      name: "signup",
      component: UserSignupForm,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: UserLoginForm,
      meta: {
        requiresGuest: true
      }
    }
  ]
});

router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresGuest)) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        next({ path: "/" });
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

export default router;
