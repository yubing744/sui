<template>
  <div class="_sui-io" >
    <div class="main-wrapper">
      <nuxt />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "nuxt-property-decorator";

  @Component({
    layout: "errorlayout",
  })
  export default class errorLayout extends Vue {}
</script>
