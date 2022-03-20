<template>
    <section class="banner sui-banner">
        <div class="container">
            <div class="banner-content">
                <slot />
            </div>
        </div>
    </section>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class LandingBanner extends Vue {
    // @Prop({ required: true }) readonly title!:string , Prop
}
</script>
