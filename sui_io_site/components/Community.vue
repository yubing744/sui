<template>
    <section class="sui-community section section-padding" id="community">
        <div class="container">
            <div class="section-heading heading-dark">
                <h2 class="title">Sui Community</h2>
                <p class="mb--10">
                    Join the movement. Follow along, meet fellow builders on
                    Discord, or get updates.
                </p>
            </div>
            <div class="row mb--80">
                <form>
                    <div class="input-group">
                        <input
                            type="email"
                            class="form-control"
                            placeholder="Email address"
                        />
                        <button class="subscribe-btn" type="submit">
                            Start Building →
                        </button>
                    </div>
                </form>
            </div>
            <div class="row">
                <SocialsCTA />
            </div>
        </div>
        <div class="bg-bottom"></div>
        <div class="footerCicle"></div>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class SuiCommunityComponent extends Vue {}
</script>
