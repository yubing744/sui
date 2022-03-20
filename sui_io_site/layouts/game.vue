<template>
    <section class="sui-game" :class="{ activeMenuClass: overlayMenu }">
        <div class="main-wrapper">
            <Header />
            <nuxt />
            <Footer />
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { RootState } from '~/store'

@Component
export default class GameLayout extends Vue {
    get overlayMenu(): boolean {
        return (this.$store.state as RootState).activeMenu
    }
}
</script>
