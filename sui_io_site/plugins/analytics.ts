import Vue from "vue";
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: "AIzaSyC_90EaU_Vfvh4prSRhwHwG7g8EOAJML6A",
  authDomain: "sui-io.firebaseapp.com",
  projectId: "sui-io",
  storageBucket: "sui-io.appspot.com",
  messagingSenderId: "353886383772",
  appId: "1:353886383772:web:be544dc1b4eac188f48759",
  measurementId: "G-YKP53WJMB0",
};

const fbapp = initializeApp(firebaseConfig);
const analytics = getAnalytics(fbapp);
declare module "vue/types/vue" {
  interface Vue {
    $fbapp(): void;
    $analytics(): void;
    $logEvent(event: string, params: object): void;
    $performance(): void;
  }
}

Vue.prototype.$analytics = () => analytics;
Vue.prototype.$logEvent = () => logEvent;
Vue.prototype.$performance = () => getPerformance(fbapp);
