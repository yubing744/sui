import Vue from "vue";
import sal from "sal.js";

const Options: any = { threshold: 0.1, once: true };

declare module "vue/types/vue" {
  interface Vue {
    $sal(): void;
  }
}

Vue.prototype.$sal = () => sal(Options);
