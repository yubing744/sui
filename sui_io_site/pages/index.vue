<template>
  <main class="_sui-container-l" ref="main">
    <LandingBanner>
      <h1
        class="title"
        data-behavior="Animate"
        data-animateType="fadeInLeftSmall"
      >
        Build without <span class="_sui-blue">boundaries</span>
      </h1>
      <p class="mb--20" data-sal="slide-up" data-sal-duration="1000">
        Sui is a boundless platform to build rich and dynamic on-chain assets
        from gaming to finance.
      </p>
      <div class="sui-gaming-cta">
        <a
          href="https://devportal-30dd0.web.app/build"
          class="sui-btn btn-fill-primary"
          >Start Building →</a
        >
      </div>
    </LandingBanner>
    <Whysui :content="whySui">
      <div class="row sui-grid">
        <div
          class="_grid-item _sui_ws"
          data-sal="slide-up"
          data-sal-duration="1000"
          data-sal-delay="100"
        >
          <div
            class="project-grid _whysui-list _sui-fast _sui_why-bg1 _sub-grid-item"
          >
            <div class="content">
              <h3 class="title">Fast A*F</h3>

              <p class="mt--20 _copy">
                Horizontally scalable,<br />
                instant finality, low fees.
              </p>
            </div>
          </div>
          <div
            class="project-grid _whysui-list _sui-fast _sui_why-bg2 _sub-grid-item"
            data-sal="slide-up"
            data-sal-duration="1000"
            data-sal-delay="150"
          >
            <div class="content">
              <h3 class="title">
                Digital assets<br />
                unlocked
              </h3>

              <p class="mt--20 _copy">
                Create more utility into NFTs. Make NFTs work for you.
              </p>
            </div>
          </div>
        </div>
        <div
          class="_grid-item"
          data-sal="slide-up"
          data-sal-duration="1000"
          data-sal-delay="200"
        >
          <div class="project-grid _whysui-list _sui-fast-1 _sui_why-bg3">
            <div class="content">
              <h3 class="title">Designed for <br />real people</h3>

              <ul class="mt--20 _copy">
                <li>
                  Lost key? No problem. Recover assets without an intermediary.
                </li>
                <li>
                  Human readable signing requests: Know exactly what you're
                  giving permission for.
                </li>
                <li>
                  Send assets directly via email, SMS, DMs and any other
                  channel.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        class="row mb--40 _fl-fix"
        data-sal="slide-up"
        data-sal-duration="1000"
        data-sal-delay="250"
        id="developer"
      >
        <div class="col-md-12">
          <DeveloperResources />
        </div>
      </div>
      <div class="row sui-grid-1-3">
        <div class="_sui_ws _grid-item _fl-fix">
          <div class="project-grid _whysui-list _sui-fast _sui_why-bg4">
            <div class="content">
              <div class="col-md-6">
                <h3 class="title">Safe & <br />secure smart contracts</h3>

                <p class="mt--20 _copy">
                  Spend less time fixing smart contracts, more time building
                  cool sh*t.
                </p>
                <a
                  href="https://devportal-30dd0.web.app/build/move"
                  class="sui-btn btn-fill-primary"
                  >Learn about Move →</a
                >
              </div>
            </div>
          </div>
        </div>
        <div class="_grid-item _fl-fix">
          <div class="project-grid _whysui-list _sui-fast _sui_why-bg5">
            <div class="content">
              <h3 class="title">Green</h3>

              <p class="mt--20 _copy">
                Sui has the lowest cost per compute of any blockchain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Whysui>
    <Community />

    <div class="bg-top"></div>
  </main>
</template>

<script lang="ts">
  import { Component, Vue } from "nuxt-property-decorator";
  import { MetaInfo } from "vue-meta";

  @Component
  export default class HomePageComponent extends Vue {
    title!: string;
    whySui: any = {
      title: "Why Sui?",
      subtitle: "A STEP-FUNCTION CHANGE IN BLOCKCHAIN DESIGN",
      description:
        "Sui is the first permissionless Layer 1 blockchain designed from the ground up to enable creators and developers to build experiences that cater to the next billion users in web3.",
    };
    head(): MetaInfo {
      return {
        title: "Sui - Build without boundaries",
        meta: [
          {
            name: "description",
            content:
              "Sui is the first permissionless Layer 1 blockchain designed from the ground up to enable creators and developers to build experiences that cater to the next billion users in web3.",
          },
        ],
      };
    }
    mounted() {
      setTimeout(() => {
        // const rellax = new Rellax('.rellax');
      }, 500);
    }
  }
</script>
