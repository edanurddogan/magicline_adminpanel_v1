import { defineStore } from "pinia";

export const useMenuStore = defineStore("menu", {
  state: () => ({
    vheadquarters: true,
    vEmployees: true,
    vUsers: true,
    vVendors: true,
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
    isHeadquartersVisible: (state) => state.vheadquarters,
    isEmployeesVisible: (state) => state.vEmployees,
    isUsersVisible: (state) => state.vUsers,
    isVendorsVisible: (state) => state.vVendors,
  },
  actions: {
    showHeadquarters(show) {
      this.vheadquarters = show;
    },
    showEmployees(show) {
      this.vEmployees = show;
    },
    showUsers(show) {
      this.vUsers = show;
    },
    showVendors(show) {
      this.vVendors = show;
    },
  },
});
