<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
layout.hideHeader();
layout.closeLeftDrawer();
//layout.hideFooter();
</script>
<template>
  <q-page class="flex flex-center">
    <q-img
      class="bg"
      :src="darkMode ? '/src/assets/loginbg4.jpg' : '/src/assets/loginbg1.jpg'"
    ></q-img>
    <locale-switcher class="absolute absolute-top-right on-left" />
    <div class="column">
      <q-card bordered class="login-card shadow-20" style="width: 500px">
        <q-item class="bg-primary text-white center">
          <q-item-section>
            <q-img
              :src="`src/assets/logo/${firm.code}/logo2.png`"
              spinner-color="white"
              fit="fill"
              position="center"
              style="
                height: 150px;
                width: 300px;
                display: block;
                margin-left: auto;
                margin-right: auto;
              "
            />
          </q-item-section>
        </q-item>

        <q-card-section style="width: 100%">
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
              :type="isPwd ? 'password' : 'text'"
              v-on:keyup.enter="onSubmit"
              :rules="[(val) => (val && val.length > 0) || $t('required')]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <div>
              <div class="row">
                <div class="col text-left">
                  <q-toggle
                    v-model="remember"
                    :label="$t('login.rememberme')"
                  />
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
                    class="login-button q-ma-md"
                    :label="$t('login.login')"
                    @click="onSubmit"
                    color="primary"
                  >
                    <template v-slot:loading>
                      <q-spinner-hourglass class="on-left" />
                    </template>
                  </q-btn>

                  <!-- 
            <q-btn
              :loading="loading"
              class="login-button q-ma-md"
              :label="$t('iamaseller')"
              :to="{ name: 'loginvendor' }"
              color="primary"
            /> -->
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
      <div>
        <!-- Infaura Logo -->
        <!-- <div style="display: flex; justify-content: center">
          <q-img
            src="~/assets/logo/Infaura_ArGe_Horizontal_WS.png"
            spinner-color="white"
            fit="contain"
            style="max-height: 250px; max-width: 250px"
          >
          </q-img>
        </div> -->
      </div>
    </div>
  </q-page>
  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import { LocalStorage } from "quasar";
import LocaleSwitcher from "src/components/LocaleSwitcher.vue";
import { useUserStore } from "src/stores/user";
const user = useUserStore();

export default defineComponent({
  setup() {},
  components: {
    LocaleSwitcher,
  },
  mounted() {
    document.title = `${firm.name} - Login`;
    this.darkMode = LocalStorage.has("darkMode")
      ? JSON.parse(LocalStorage.getItem("darkMode"))
      : true;
  },
  data() {
    return {
      email: user.savedLogin ? user.savedLogin.email : "",
      password: user.savedLogin ? user.savedLogin.password : "",
      remember: user.savedLogin ? user.savedLogin.remember : false,
      loading: false,
      darkMode: false,
      isPwd: true,
    };
  },
  // mounted() {
  //   user.test();
  // },
  methods: {
    async onSubmit() {
      this.loading = true;
      await user
        .login(this.email, this.password, this.remember)
        .then(() => {
          this.$router.push({ path: "/calendar" });
          this.$emit("authcontrol");
          this.$emit("userControl");
          this.$emit("leftMenuOpen");
          this.$emit("headerShow");
          //this.layout.showHeader();
          //this.layout.openLeftDrawer();
          //this.layout.showFooter();
          this.loading = false;
        })
        .catch(function (error) {
          console.error("error :", error);
          if (error.response && error.response.status === 401) {
            alert("Invalid email or password.");
          } else {
            alert("An error occurred during login. Please try again.");
          }
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
