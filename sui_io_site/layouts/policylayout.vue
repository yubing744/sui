<template>
  <div class="_sui-io" :class="{ activeMenuClass: overlayMenu }">
    <div class="main-wrapper">
      <Header />
      <nuxt />
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "nuxt-property-decorator";
  import { RootState } from "~/store";

  @Component({
    layout: "policy",
  })
  export default class PolicyLayout extends Vue {
    get overlayMenu(): boolean {
      return (this.$store.state as RootState).activeMenu;
    }
  }
</script>
