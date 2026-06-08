<template>
  <div
    class="fullscreen text-white text-center q-pa-md flex flex-center bgimg"
    style="
      background-color: #04074a;
      background-image: url('/src/assets/img/404.png');
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: center;
      background-attachment: fixed;
    "
  >
    <div>
      <!--<div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>-->

      <q-btn
        class="q-mt-xl glossy"
        color="white"
        icon="history"
        text-color="primary"
        size="lg"
        stack
        glossy
        rounded
        push
        :to="this.$router.options.history.state.back"
        label="Ana Sayfaya Dön"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "ErrorNotFound",
  data() {
    return {
      lastPath: null,
    };
  },
  created() {
    this.$setPageTitle("404");
    this.lastPath = this.$router.options.history.state.back;
  },
  methods: {
    prevRoutePatch() {
      this.$logger.log(this.lastPath);
      return this.lastPath ? this.lastPath : "/";
    },
  },
});
</script>
<style lang="css">
bgimg {
  background-image: url("/src/assets/img/404.png");
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
