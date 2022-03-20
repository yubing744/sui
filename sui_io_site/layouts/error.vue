<template>
    <section class="_sui-err" :class="{ activeMenuClass: overlayMenu }">
        <section class="error-page onepage-screen-area">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6">
                        <div
                            class="content sal-animate"
                            data-sal="slide-up"
                            data-sal-duration="800"
                            data-sal-delay="400"
                        >
                            <h2 class="title text-left">
                                {{
                                    error.statusCode === 404
                                        ? pageNotFound
                                        : otherError
                                }}
                            </h2>
                            <p>
                                It looks like nothing found at this location.
                                Try to navigate the menu or go to the home page.
                            </p>
                            <nuxt-link to="/" class="sui-btn btn-fill-primary"
                                >Go Back</nuxt-link
                            >
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <div class="bg-top" data-sal="slide-up" data-sal-delay="100"></div>
        <!-- - section 404 -->
    </section>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { RootState } from '~/store'
interface ErrorResponse {
    readonly statusCode: number
}
@Component({
    layout: 'policylayout',
    head(this: Error): {} {
        return {
            title:
                this.error.statusCode === 404
                    ? this.pageNotFound
                    : this.otherError,
        }
    },
})
export default class Error extends Vue {
    // props
    @Prop({ default: null })
    error!: ErrorResponse

    // declare variables
    pageNotFound: string = "That page can't be found"
    otherError: string = 'An error occurred'
    get overlayMenu(): boolean {
        return (this.$store.state as RootState).activeMenu
    }
}
</script>
<style lang="scss" scoped>
._sui-err {
    .section {
        margin: 0;
    }
    p,
    h1 {
        color: #161b25;
    }
    .text-left {
        text-align: left;
    }
}
</style>
