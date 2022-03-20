<template>
  <section class="sui-game">
    <div class="main-wrapper">
      <Header />
      <nuxt />
      <Footer />
    </div>
  </section>
</template>

<script lang="ts">
  import { Component, Vue } from "nuxt-property-decorator";
  import { RootState } from "~/store";

  @Component
  export default class GameLayout extends Vue {
    get overlayMenu(): boolean {
      return (this.$store.state as RootState).activeMenu;
    }
  }
</script>
<style lang="scss" scoped>
  .main-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
</style>
