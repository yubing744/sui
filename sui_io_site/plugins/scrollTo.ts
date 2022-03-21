import Vue from "vue";

/* global window, $ */
const scrollToElment = (refName: string) => {
  if (!refName) return;
  const element: any = window.document.querySelector(`#${refName}`);
  if (!element) return;
  window.scrollTo({ top: element.offsetTop, behavior: "smooth" });
};

declare module "vue/types/vue" {
  interface Vue {
    $scrollToElment(el: string): void;
  }
}

Vue.prototype.$scrollToElment = (el: string) => scrollToElment(el);
