<template>
  <header
    class="header sui-header"
    :class="{ 'sui-menu-active': selectedMenu }"
    @mouseleave="selectActiveMenu(false)"
  >
    <div class="sui-mainmenu" :class="{ 'sui-sticky': sticky }">
      <div class="container">
        <div class="header-navbar">
          <div class="header-logo">
            <nuxt-link to="/"
              ><img
                class="light-version-logo"
                src="~/assets/img/sui-logo.svg"
                alt="Sui logo"
            /></nuxt-link>
          </div>
          <div class="header-main-nav">
            <!-- Start Mainmanu Nav -->
            <nav class="mainmenu-nav">
              <div class="d-block">
                <div class="mobile-nav-header">
                  <button class="mobile-menu-close" data-bs-dismiss="offcanvas">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <ul class="mainmenu">
                <li
                  v-for="(itm, i) in menu.links"
                  :key="i"
                  :class="[
                    {
                      'menu-item-has-children': itm.subMenu,
                    },
                    {
                      'sui-active': selectedMenu == itm.label,
                    },
                    {
                      'sui-active': activePermalink == itm.label,
                    },
                  ]"
                >
                  <a
                    :href="itm.link"
                    @mouseover="selectActiveMenu(itm.label, itm.external)"
                    :class="{ suiexternal: itm.external }"
                    :target="itm.external ? '_blank' : ''"
                    >{{ itm.label }}</a
                  >
                  <ul class="sui-submenu" v-if="itm.subMenu">
                    <li
                      v-for="(submenu, k) in itm.subMenu"
                      :key="k"
                      @mouseover="selectActiveMenu(itm.label, itm.external)"
                    >
                      <nuxt-link v-if="!submenu.external" :to="submenu.link">{{
                        submenu.label
                      }}</nuxt-link>
                      <a
                        class="suiexternal"
                        v-else="submenu.external"
                        :href="submenu.link"
                        target="_blank"
                        >{{ submenu.label }}</a
                      >
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
            <!-- End Mainmanu Nav -->
          </div>
          <div class="header-action">
            <ul class="list-unstyled">
              <li class="header-btn">
                <a
                  href="https://devportal-30dd0.web.app/"
                  class="sui-btn btn-fill-white"
                >
                  Get Started →</a
                >
              </li>
              <li class="mobile-menu-btn sidemenu-btn d-lg-none d-block">
                <button
                  class="btn-wrap"
                  @click="selectActiveMenu(!selectedMenu)"
                >
                  <span></span>
                  <span></span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="_sui-menu-bg">
      <section class="sui-m-menu container">
        <div class="row">
          <div class="col-12">
            <ul class="m-top-menu">
              <li
                v-for="(itm, i) in menu.links"
                :key="i"
                :class="[
                  {
                    'menu-item-has-children': itm.subMenu,
                  },
                  {
                    'sui-active': selectedMenu == itm.label,
                  },
                  {
                    'sui-active': activePermalink == itm.label,
                  },
                ]"
              >
                <a
                  :href="itm.external ? itm.link : '#'"
                  @click="selectActiveMenu(itm.label, itm.external)"
                  :class="[
                    { suiexternal: itm.external },
                    { 'sui-m-icons': itm.subMenu },
                  ]"
                  :target="itm.external ? '_blank' : ''"
                >
                  <div
                    class="sui-m-icon"
                    :class="itm.iconName"
                    v-if="itm.subMenu"
                  >
                    <img :src="`/assets/img/icons/${itm.iconName}.svg`" />
                  </div>
                  {{ itm.label }}</a
                >
                <ul class="m-sub-menu" v-if="itm.subMenu">
                  <li v-for="(submenu, k) in itm.subMenu" :key="k">
                    <nuxt-link v-if="!submenu.external" :to="submenu.link">{{
                      submenu.label
                    }}</nuxt-link>
                    <a
                      v-else="submenu.external"
                      :href="submenu.link"
                      target="_blank"
                      @click="selectActiveMenu(!selectedMenu)"
                      >{{ submenu.label }}</a
                    >
                  </li>
                </ul>
              </li>
            </ul>
            <div class="_sui-m-btn">
              <a
                href="https://devportal-30dd0.web.app/"
                class="sui-btn btn-fill-primary"
                >Start Building →</a
              >
            </div>
          </div>
        </div>
      </section>
    </div>
  </header>
</template>
<script lang="ts">
  import { Component, Vue, Watch } from "nuxt-property-decorator";
  import { RootState } from "~/store";

  interface Menu {
    links: [
      {
        label: string;
        link: string;
        external?: boolean;
        subMenu: [
          {
            label: string;
            link: string;
            external?: boolean;
          }
        ];
      }
    ];
  }

  @Component
  export default class Header extends Vue {
    selectedMenu: string | boolean = false;
    sticky: boolean = false;
    activePermalink: string | boolean = false;

    @Watch("$route")
    onUrlChange(newVal: any) {
      this.selectActiveMenu(false);
      this.addActiveClassToMenu();
      this.initSal();
    }
    get menu(): Menu {
      return (this.$store.state as RootState).menu;
    }

    selectActiveMenu(path: string | boolean, external?: boolean): void {
      if (external) {
        return;
      }

      this.selectedMenu = path;
      this.$store.commit("setactiveMenu", this.selectedMenu);
    }

    handleScroll() {
      this.sticky = window.scrollY > 10;
    }
    addActiveClassToMenu() {
      const $this = this;
      setTimeout(() => {
        const routeData = this.$route;

        if (!routeData.name || !this.menu.links) return;
        const parentRouteName = routeData.name?.split("-")[0];
       
        const rCheck = this.menu.links.filter(
          (itm: any) =>
            itm.label.toLowerCase() === parentRouteName.toLowerCase()
        );
        if (rCheck.length > 0) {
          $this.activePermalink = rCheck[0].label;
          return;
        }
        $this.activePermalink = false;
      }, 100);
    }
    beforeMount() {
      window.addEventListener("scroll", this.handleScroll);
    }
    beforeDestroy() {
      window.removeEventListener("scroll", this.handleScroll);
    }
    

    initSal() {
      const $this:any = this;
      const hash = $this.$route.hash
      setTimeout(() => {
        $this.$sal();
        $this.$scrollToElment(hash.replace('#', ''))
      }, 200);
    }

    mounted() {
      this.addActiveClassToMenu();
      this.initSal();
    }
  }
</script>
