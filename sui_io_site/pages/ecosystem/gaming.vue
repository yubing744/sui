<template>
    <main class="_sui-gaming _sui-container-l">
        <LandingBanner>
            <h1
                class="title"
                data-sal="slide-up"
                data-sal-duration="1000"
                data-sal-delay="100"
            >
                Welcoming the next generation of players, creators and games
            </h1>
            <div class="sui-gaming-cta">
                <a
                    href="https://devportal-30dd0.web.app/build"
                    class="sui-btn btn-fill-primary"
                    >Start Building →</a
                >
                <a href="#" class="sui-btn btn-line">Join community →</a>
            </div>
        </LandingBanner>
        <Whysui :content="whySuiGaming">
            <div class="row mb--40 _rd">
                <div class="col-md-12">
                    <div class="_sui_dev_resouce bg-color-light-sui _sui-game">
                        <div class="row _dev-content">
                            <div class="col-md-9">
                                <h4>
                                    Spend less time writing smart contracts,
                                    more time building fun games
                                </h4>
                                <a
                                    href="https://devportal-30dd0.web.app/"
                                    class="sui-btn btn-fill-primary"
                                >
                                    Read documentation →</a
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mb--40 _fl-fix sui-grid">
                <div class="_grid-item">
                    <div
                        class="project-grid _whysui-list _sui-fast-1 _sui_why-bg3"
                    >
                        <div class="content">
                            <h3 class="title">
                                Designed for <br />real people
                            </h3>

                            <ul class="mt--20 _copy">
                                <li>
                                    Lost key? No problem. Recover assets without
                                    an intermediary.
                                </li>
                                <li>
                                    Human readable signing requests: Know
                                    exactly what you're giving permission for.
                                </li>
                                <li>
                                    Send assets directly via email, SMS, DMs and
                                    any other channel.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="_grid-item _fl-fix _sui_ws">
                    <div
                        class="project-grid _whysui-list _sui-fast _sui_why-bg2"
                    >
                        <div class="content">
                            <h3 class="title">
                                Digital assets<br />reimagined
                            </h3>

                            <p class="mt--20 _copy">
                                Create rich gaming economies with decentralized
                                marketplaces and composable, on-chain items.
                            </p>
                            <a
                                href="https://devportal-30dd0.web.app/build"
                                class="sui-btn btn-fill-primary"
                            >
                                Start Building →</a
                            >
                        </div>
                    </div>
                    <div
                        class="project-grid _whysui-list _sui-fast _sui_why-bg7"
                    >
                        <div class="content">
                            <h3 class="title">Near-zero fees</h3>

                            <p class="mt--20 _copy">
                                Each transaction on Sui costs a fraction of a
                                cent.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mb--40 _rd">
                <div class="col-md-12">
                    <DeveloperResources />
                </div>
            </div>
            <div class="row mb--40 sui-grid">
                <div class="_grid-item _sui_ws">
                    <div
                        class="project-grid _whysui-list _sui-fast _sui_why-bg1"
                    >
                        <div class="content">
                            <h3 class="title">Fast A*F</h3>

                            <p class="mt--20 _copy">
                                Sui has horizontally scalable throughput and
                                storage, increasing capacity as your
                                applications scale
                            </p>
                        </div>
                    </div>
                </div>
                <div class="_grid-item _last">
                    <div
                        class="project-grid _whysui-list _sui-fast _sui_why-bg5"
                    >
                        <div class="content">
                            <h3 class="title">Green</h3>

                            <p class="mt--20 _copy">
                                Sui has the lowest cost per compute of any
                                blockchain.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Whysui>
        <Community />
        <div class="bg-top" data-sal="slide-up" data-sal-delay="100"></div>
    </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'

@Component
export default class HomePageComponent extends Vue {
    title!: string
    whySuiGaming: any = {
        title: 'Why Sui?',
        subtitle: 'A STEP-FUNCTION CHANGE IN BLOCKCHAIN DESIGN',
        description:
            'Sui is the first permissionless Layer 1 blockchain designed from the ground up to enable creators and developers to build experiences that cater to the next billion users in web3.',
    }

    head(): MetaInfo {
        return {
            title: 'Sui - Gaming',
        }
    }
    mounted() {
        const $this = this
        setTimeout(() => {
            $this.$sal()
        }, 200)
    }
}
</script>
