import { boot } from "quasar/wrappers";
import axios from "axios";
import { useUserStore } from "src/stores/user";
import { Notify } from "quasar";
import { i18n } from "boot/i18n";
//import { interceptorsMessage } from "../../apiServices/interceptors/axiosInterceptor";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const api = axios.create({
baseURL: "http://localhost:8081/api/",
  //baseURL: "http://baseapi_bg.magiclineenergy.com/api/",
  //baseURL: "http://api.infaura.com:8081/api/",
  //baseURL: "https://base-uat.energysarj.com.tr/api/",  // Can Enerji UAT
  //baseURL: "https://bo-uat-api.e4sarj.com.tr/api/", // E4 UAT
//baseURL: "https://api.magiclineapp.com/api/", // Magicline Prod
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  app.config.globalProperties.$pinia.use(() => ({ api }));

  api.interceptors.request.use((reqConfig) => {
    const user = useUserStore();
    if (user.isAuthenticated)
      reqConfig.headers["Authorization"] = `Bearer ${user.token}`;

    reqConfig.headers["Content-Type"] = "application/json";
    reqConfig.headers["Access-Control-Allow-Origin"] = "*";

    return reqConfig;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const user = useUserStore();
      //this.$logger.log(error);
      if (error.response.data.error?.errors) {
        this.$logger.log(error.response);
        /*error.response.data.error?.errors.forEach(element => {
          capt +=
        });*/
      }
      if (error.response.status === 401) {
        user.logout();
      }
      //TODO: interceptorsMessage eklenecek
      //interceptorsMessage(error.response);
      if (error.response.status != 501 && error.response.status != 401) {
        Notify.create({
          type: "negative",
          html: true,
          message: `<b>${i18n.global.t("apierror")}</b><br>${
            error.response.data.error?.message || error.response.data.error
          }`,
          //caption: error.response.data.error.message,
        });
      }
      throw error;
    },
  );
});

export { api };
