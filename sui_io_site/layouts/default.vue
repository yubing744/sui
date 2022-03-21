<template>
  <div class="_sui-io">
    <div class="main-wrapper" :class="{ activeMenuClass: overlayMenu }">
      <Header />
      <ul class="list-unstyled shape-group-20 _sui-ani-bottom">
        <li class="shape shape-5">
          <img src="/img/blocks/block5.png" alt="Line" />
        </li>
        <li class="shape shape-7">
          <img src="/img/blocks/block6.png" alt="Line" />
        </li>
        <li class="shape shape-4">
          <img src="/img/blocks/block7.png" alt="Line" />
        </li>
        <li class="shape shape-5">
          <img src="/img/blocks/block8.png" alt="Line" />
        </li>
      </ul>

      <nuxt />
      <ul class="list-unstyled shape-group-9 _sui-ani-top">
        <li class="shape shape-7">
          <img src="/img/blocks/block1.png" alt="circle" />
        </li>
        <li class="shape shape-2">
          <img src="/img/blocks/block2.png" alt="Line" />
        </li>
        <li class="shape shape-3">
          <img src="/img/blocks/block3.png" alt="Comments" />
        </li>
        <li class="shape shape-4">
          <img src="/img/blocks/block4.png" alt="Line" />
        </li>
      </ul>

      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "nuxt-property-decorator";
  import { RootState } from "~/store";

  @Component
  export default class BaseLayout extends Vue {
    get overlayMenu(): boolean {
      return (this.$store.state as RootState).activeMenu;
    }
  }
</script>
<style lang="scss" scoped>
  ._sui-io {
    background-image: url(/assets/img/backgrounds/background_texture_bottom.jpg);
    background-position: center 95%;
    background-size: contain;
    background-repeat: no-repeat;
    @media only screen and (max-width: 767px) {
      background-size: 300%;
      background-position: center 90%;
    }
  }
  .main-wrapper {
    overflow: hidden;
    background-color: var(--dark-bg-color);
    background-image: url(/assets/img/backgrounds/background_texture_top.jpg);
    background-repeat: no-repeat;
    background-position: center top;
    background-size: contain;
    @media only screen and (max-width: 767px) {
      background-size: 300%;
      padding: 5px;
    }
  }
</style>
