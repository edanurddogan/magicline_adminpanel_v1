<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">{{ $t("users.resetCustomerPassword") }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="q-pa-md">
          <div class="q-gutter-md text-subtitle1">
            <div>
              <span class="text-bold">{{ $t("users.nameSurname") }}:</span>
              {{ modelValue.name }} {{ modelValue.surname }}
            </div>
            <div>
              <span class="text-bold">{{ $t("users.email") }}:</span>
              {{ modelValue.email }}
            </div>
            <div>
              <span class="text-bold">{{ $t("users.phone") }}:</span>
              {{ modelValue.phone }}
            </div>
          </div>

          <div class="row justify-end q-mt-md">
            <q-btn color="primary" @click="onSubmit" no-caps>
              {{ $t("users.resetCustomerPassword") }}
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "CustomerResetPasswordForm",
  props: {
    modelValue: {
      type: Number,
      default: () => null,
    },
  },
  emits: ["completed"],
  components: {},
  computed: {},
  data() {
    return {
      maximizedToggle: false,
    };
  },
  async mounted() {
    this.init();
  },
  methods: {
    init() {},

    async onSubmit() {
      try {
        const response = await this.$api.post(
          `adminResetCustomerPassword/${this.modelValue.id}`
        );

        if (response.status == 200) {
          this.$q.notify({
            type: "positive",
            message: this.$t("order.sended"),
          });
          this.$emit("completed");
        }
      } catch (error) {
        this.$logger.error("reset password", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s
.my-sticky-header-table
  /* height or max-height is important */
  max-height: 600px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
