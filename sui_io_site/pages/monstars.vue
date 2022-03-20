<template>
  <section class="container">
    <section class="sui-game-monstars gt">
      <iframe title="Sue Monstars Game" src="/games/monstars/index.html">
      </iframe>
    </section>
  </section>
</template>
<script lang="ts">
  import { Component, Vue } from "nuxt-property-decorator";
  import { MetaInfo } from "vue-meta";

  @Component({
    layout: "game",
  })
  export default class HomePageComponent extends Vue {
    head(): MetaInfo {
      return {
        title: "Sui - Game -Monstars",
      };
    }
  }
</script>
<style lang="scss" scoped>
  .content {
    max-height: 70vh;
  }
  .sui-game-monstars {
    background-color: #fff;
    padding: 20px;
    display: flex;
    margin: auto;
    justify-content: center;
    position: relative;
    padding-top: 56.25%;
    margin-top: 40px;
  }
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-height: 600px;
  }
  .gt {
    margin-top: 150px;
  }
</style>
