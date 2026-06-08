<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-sm">
    <!-- Araçlar Seçimi -->
    <q-item class="col-lg-2 col-md-2 col-sm-12 col-xs-12 column q-space">
      <q-item-section>
        <q-select
          v-model="selectedVehicles"
          style="width: 100%"
          :options="filteredVehicles"
          option-value="id"
          option-label="licensePlate"
          :label="$t('vehicle.vehicles')"
          :loading="loading"
          options-dense
          hide-selected
          map-options
          multiple
          clearable
          outlined
          dense
          use-input
          transition-show="scale"
          transition-hide="scale"
          @filter="filterVehicles"
        >
          <template #prepend>
            <q-icon name="electric_car" />
          </template>
        </q-select>
      </q-item-section>
      <q-item-section>
        <q-card v-if="selectedVehicles?.length" class="q-pa-xs overflow-auto">
          <div class="column q-gutter-xs">
            <q-chip
              v-for="item in selectedVehicles"
              :key="item.id"
              removable
              @remove="removeFilter(item, 'discountVehicles')"
              dense
              :disable="mode === 'details'"
              class="full-width no-radius"
            >
              {{ item.licensePlate }}
            </q-chip>
          </div>
        </q-card>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section class="q-pa-sm items-end">
        <q-btn
          no-caps
          :label="$t('edit')"
          color="primary"
          :disable="mode === 'details' || selectedVehicles.length === 0"
          @click="onSubmit()"
        />
      </q-item-section>
    </q-item>
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "StationAccessPermissionsForm",
  components: {},
  emits: ["completed"],
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    mode: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      vehicles: [],
      filteredVehicles: [],
      selectedVehicles: [],
      loading: true,
    };
  },
  computed: {},

  async mounted() {
    this.init();
  },
  methods: {
    init() {
      try {
        this.$logger.log("StationAccessPermissions", this.modelValue);
        this.getList();
        this.getVehicles();
      } catch (error) {
        this.$logger.error("init:", error);
      }
    },

    async getList() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          `getStationAccessPermissions/${this.modelValue.id}`,
        );
        this.selectedVehicles = response.data.data;
        //this.$logger.log("getStationAccessPermissions", this.selectedVehicles);
        this.loading = false;
      } catch (error) {
        this.$logger.error("getStationAccessPermissions", error);
      }
    },
    async getVehicles() {
      try {
        this.loading = true;
        const response = await this.$api.get("getVehicles");
        this.vehicles = this.filteredVehicles = response.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getVehicles error", error);
      }
    },
    filterVehicles(val, update) {
      try {
        const normalizedVal = this.$normalizeTurkishString(val);
        update(() => {
          val === ""
            ? (this.filteredVehicles = this.vehicles)
            : (this.filteredVehicles = this.vehicles.filter((vehicle) =>
                this.$normalizeTurkishString(vehicle.licensePlate).includes(
                  normalizedVal,
                ),
              ));
        });
      } catch (error) {
        this.$logger.error("filterVehicles error", error);
      }
    },
    removeFilter(item) {
      const list = this.selectedVehicles;
      const index = list.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        list.splice(index, 1);
      }
    },
    async onSubmit() {
      try {
        const body = {
          stationId: this.modelValue.id,
          vehicles: this.selectedVehicles,
        };
        const response = await this.$api.post(
          "postStationAccessPermission",
          body,
        );
        if (response.status === 200) {
          this.$q.notify({ type: "positive", message: this.$t("saved") });
          this.$emit("completed");
        }
      } catch (error) {
        this.$logger.error("onSubmit error", error);
      }
    },
  },
});
</script>

<style lang="sass">
.my-sticky-header-table
  max-height: 600px
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    thead tr th
      position: sticky
      z-index: 1
    thead tr:first-child th
      top: 0
  &.q-table--loading thead tr:last-child th
    top: 48px
</style>
