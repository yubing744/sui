<template>
  <section class="sui-community section section-padding" id="community">
    <div class="container">
      <div class="section-heading heading-dark">
        <h2 class="title">Sui Community</h2>
        <p class="mb--10">
          Join the movement. Follow along, meet fellow builders on Discord, or
          get updates.
        </p>
      </div>
      <div class="row mb--100">
        <form @submit.prevent>
          <div
            class="input-group"
            :class="{ error: notValidEmail, suiLoading: loading }"
          >
            <input
              type="email"
              class="form-control"
              placeholder="Email address"
              v-model="email"
              :disabled="loading"
            />
            <button
              class="subscribe-btn"
              @click="subscripEmail"
              v-if="!loading"
            >
              {{ notValidEmail ? "Invalid email" : "Start Building →" }}
            </button>
            <button
              class="subscribe-btn"
              @click="subscripEmail"
              v-if="loading"
              disabled
            >
              <Loading />
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
  import { Component, Vue } from "nuxt-property-decorator";

  @Component
  export default class SuiCommunityComponent extends Vue {
    email: string = "";
    loading: boolean = false;
    err: boolean = false;
    response: string = "";

    testEmailAddress(data: string): boolean {
      const EMAIL_REGX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
      return data === "" || !EMAIL_REGX.test(data) ? false : true;
    }

    async fetch() {
      // this.posts = await this.$http.$get('https://api.nuxtjs.dev/posts')
    }

    async subscripEmail() {
      this.loading = true;
      console.log(this.email);
      try {
        if (!this.testEmailAddress(this.email)) {
          return;
        }
        // await this.$http.$get('https://api.nuxtjs.dev/posts')
        this.email = "";
      } catch (error) {
        console.log(error);
      }
    }
    get notValidEmail() {
      return this.email !== "" && !this.testEmailAddress(this.email)
        ? true
        : false;
    }
  }
</script>
