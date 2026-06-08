<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
layout.hideHeader();
layout.closeLeftDrawer();
layout.hideFooter();
</script>
<template>
  <q-page class="flex flex-center">
    <q-img
      class="bg"
      :src="darkMode ? loginBackgrounds.dark : loginBackgrounds.light"
    ></q-img>
    <locale-switcher class="absolute absolute-top-right on-left" />

    <q-card bordered class="login-card shadow-20">
      <q-item class="bg-primary text-white">
        <q-item-section>
          <q-item-label class="text-h5 text-center">{{
            $t("login.login")
          }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-card-section>
        <q-form
          :autofocus="true"
          class="q-gutter-md text-center"
          @submit="onSubmit"
        >
          <q-input
            id="email"
            :label="$t('login.email')"
            lazy-rules
            v-model="email"
            :rules="[(val) => (val && val.length > 0) || $t('required')]"
          />
          <q-input
            id="password"
            v-model="password"
            :label="$t('login.password')"
            type="password"
            v-on:keyup.enter="onSubmit"
            :rules="[(val) => (val && val.length > 0) || $t('required')]"
          />

          <div>
            <div class="row">
              <div class="col text-left">
                <q-toggle v-model="remember" :label="$t('login.rememberme')" />
              </div>
              <div class="col text-right">
                <!--<q-btn
                  class="login-button"
                  :label="$t('login')"
                  type="submit"
                  color="primary"
                />-->
                <q-btn
                  :loading="loading"
                  class="login-button"
                  :label="$t('login.login')"
                  @click="onSubmit"
                  color="primary"
                />
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { setCssVar, Dark } from "quasar";
import LocaleSwitcher from "src/components/LocaleSwitcher.vue";
import { useUserStore } from "src/stores/user";
import { loginBackgrounds } from "src/utils/brand-assets";
const user = useUserStore();

export default defineComponent({
  setup() {},
  components: {
    LocaleSwitcher,
  },
  mounted() {
    this.$setPageTitle("Login Vendor");
    this.darkMode = LocalStorage.has("darkMode")
      ? JSON.parse(LocalStorage.getItem("darkMode"))
      : true;
  },
  data() {
    return {
      email: user.savedLogin ? user.savedLogin.email : "",
      loginBackgrounds,
      password: user.savedLogin ? user.savedLogin.password : "",
      remember: user.savedLogin ? user.savedLogin.remember : false,
      loading: false,
      darkMode: false,
    };
  },
  // mounted() {
  //   user.test();
  // },
  methods: {
    onSubmit() {
      this.loading = true;
      user
        .loginvendor(this.email, this.password, this.remember)
        .then(() => {
          this.$router.push({ path: "/index" });
          this.$emit("authcontrol");
        })
        .catch(function (error) {
          this.$logger.log("error :", error);
        });
      this.loading = false;
    },
  },
});
</script>
<style>
.bg {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
.login-card {
  width: 100%;
  max-width: 300pt;
}
.login-button {
  text-transform: uppercase;
}
</style>
