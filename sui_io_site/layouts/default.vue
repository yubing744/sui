<template>
    <div class="_sui-io">
        <div class="main-wrapper" :class="{ activeMenuClass: overlayMenu }">
            <Header />
            <nuxt />
            <Footer />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { RootState } from '~/store'

@Component
export default class BaseLayout extends Vue {
    get overlayMenu(): boolean {
        return (this.$store.state as RootState).activeMenu
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
