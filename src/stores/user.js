import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import { useStorage } from "@vueuse/core";
import routes from "src/router/routes";
import { useRouter } from "vue-router";

const router = useRouter();

export const useUserStore = defineStore("auth", {
  state: () => ({
    _token: useStorage("_token", null),
    _info: useStorage("_info", null),
    _authority: useStorage("_authority", null),
  }),
  getters: {
    token: (state) => state._token,
    info: (state) => state._info,
    isAuthenticated: (state) => !!state._token,
    savedLogin: () =>
      LocalStorage.has("savedLogin")
        ? JSON.parse(LocalStorage.getItem("savedLogin"))
        : null,
    savedAuthority: () =>
      LocalStorage.has("authority")
        ? JSON.parse(LocalStorage.getItem("authority"))
        : null,
  },
  actions: {
    setToken(token) {
      this._token = token;
    },
    setAuthority(logintype, user, auth) {
      var _auth = {};
      if (logintype == 1) {
        _auth.authName = "employee";
        //this.$logger.log("user.employeeGroupId", user.employeeGroupId);
        if (user.employeeGroupId == 1) {
          _auth.employeeGroup = user.employeeGroup;
          LocalStorage.set("authority", _auth);
          //this.$logger.log("_auth1", _auth);
        } else {
          _auth.employeeGroup = user.employeeGroup;
          _auth.authList = auth;
          LocalStorage.set("authority", _auth);
          //this.$logger.log("_auth2", _auth);
        }
      } else {
        _auth.authName = "vendor";
        _auth.vendorId = user.vendorId;
        LocalStorage.set("authority", _auth);
        //this.$logger.log("_auth3", _auth);
      }
    },
    setInfo(info) {
      this._info = info;
      LocalStorage.set("userinfo", info);
    },
    logout() {
      this._token = null;
      this._info = null;
      this._authority = null;
      this.router.push({ path: "/login" });
    },
    async login(email, password, remember) {
      return this.api
        .post("loginemployee", {
          email: email,
          password: password,
        })
        .then(async (response) => {
          //this.$logger.log(response.data);
          this.setToken(response.data.token);
          this.setAuthority(1, response.data.employee, response.data.auth);

          if (remember) this.saveLogin(email, password);
          else this.clearSavedLogin();
          if (response.data.employee) this.setInfo(response.data.employee);
        })
        .catch((error) => {
          throw error;
        });
    },
    saveLogin(email, password) {
      LocalStorage.set(
        "savedLogin",
        JSON.stringify({
          email,
          password,
          remember: true,
        })
      );
    },
    clearSavedLogin() {
      LocalStorage.remove("savedLogin");
    },
  },
});
