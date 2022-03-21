<template>
  <section class="why_sui section section-padding">
    <div class="container">
      <div class="section-heading heading-dark">
        <span class="subtitle">{{ content.subtitle }}</span>
        <h2 class="title">{{ content.title }}</h2>
        <p class="mb--10">{{ content.description }}</p>
      </div>
      <slot />
    </div>
  </section>
</template>
<script lang="ts">
  import { Component, Vue, Prop } from "nuxt-property-decorator";

  export interface WhySui {
    title: string;
    subtitle: string;
    description: string;
  }

  @Component
  export default class LandingBanner extends Vue {
    @Prop({ required: true }) readonly content!: WhySui;
  }
</script>
