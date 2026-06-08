import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    headerVisible: true,
    leftDrawerOpen: true,
    rightDrawerOpen: true,
    footerVisible: true,
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
    isHeaderVisible: (state) => state.headerVisible,
    isLeftDrawerOpen: (state) => state.leftDrawerOpen,
    isRightDrawerOpen: (state) => state.rightDrawerOpen,
    isFooterVisible: (state) => state.footerVisible,
  },
  actions: {
    async showHeader() {
      this.headerVisible = true;
    },
    async asyncHideHeader() {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.hideHeader();
          resolve();
        }, 1000);
      });
    },
    async hideHeader() {
      this.headerVisible = false;
    },
    async openLeftDrawer() {
      this.leftDrawerOpen = true;
    },
    async closeLeftDrawer() {
      this.leftDrawerOpen = false;
    },
    async asyncCloseLeftDrawer() {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.closeLeftDrawer();
          resolve();
        }, 1000);
      });
    },
    async toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    async openRightDrawer() {
      this.rightDrawerOpen = true;
    },
    async closeRightDrawer() {
      this.rightDrawerOpen = false;
    },
    async toggleRightDrawer() {
      this.rightDrawerOpen = !this.rightDrawerOpen;
    },
    async showFooter() {
      this.footerVisible = true;
    },
    async hideFooter() {
      this.footerVisible = false;
    },
  },
});
